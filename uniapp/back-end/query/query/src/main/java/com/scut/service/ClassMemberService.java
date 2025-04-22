// ClassMemberService.java
package com.scut.service;

import lombok.extern.slf4j.Slf4j;
import com.scut.entities.*;
import com.scut.mapper.ClassMemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
public class ClassMemberService {

    @Autowired
    private ClassMemberMapper classMemberMapper;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public CMA_Result addStudents(String classId, List<String> studentIds) {
        // 0. 空参数处理
        if (studentIds == null || studentIds.isEmpty()) {
            return new CMA_Result(0, 0, 0, Collections.emptyList(), Collections.emptyList());
        }

        // 1. 标准化处理
        List<String> normalizedIds = studentIds.stream()
                .map(String::trim)
                .filter(id -> !id.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        // 2. 校验班级存在
        if (classMemberMapper.getClassById(classId) == null) {
            throw new RuntimeException("Class not found");
        }

        // 3. 校验用户存在性
        List<String> existingUsers = classMemberMapper.checkUsersExist(normalizedIds);
        List<String> unFoundIds = normalizedIds.stream()
                .filter(id -> !existingUsers.contains(id))
                .collect(Collectors.toList());

        // 4. 获取已存在的成员
        List<String> existingMembers = classMemberMapper
                .getExistingMembersWithTypeCheck(classId, existingUsers);

        // 5. 计算冲突ID（存在且已加入班级的）
        List<String> conflictIds = existingUsers.stream()
                .filter(existingMembers::contains)
                .collect(Collectors.toList());

        // 6. 最终可添加的ID
        List<String> finallyAddIds = existingUsers.stream()
                .filter(id -> !existingMembers.contains(id))
                .collect(Collectors.toList());

        // 7. 执行插入
        if (!finallyAddIds.isEmpty()) {
            classMemberMapper.safeBatchInsert(classId, finallyAddIds);
        }

        // 8. 构建结果
        return new CMA_Result(
                finallyAddIds.size(),
                conflictIds.size(),
                unFoundIds.size(),
                conflictIds,
                unFoundIds
        );
    }

    @Transactional
    public CMD_Result deleteStudents(String classId, List<String> studentIds) {
        // 1. 校验班级存在
        if (classMemberMapper.getClassById(classId) == null) {
            throw new RuntimeException("Class not found");
        }

        // 2. 获取存在的学生ID（包含所有角色）
        List<String> existingIds = classMemberMapper.getExistingMembersAnyRole(classId, studentIds);

        // 3. 获取可删除的学生ID（仅MEMBER角色）
        List<String> deletableIds = classMemberMapper.getDeletableStudents(classId, existingIds);

        if (!deletableIds.isEmpty()) {
            // 4. 批量查询存在的用户（优化性能）
            List<String> checkUsers = deletableIds.stream()
                    .distinct()
                    .collect(Collectors.toList());

            // 5. 执行删除操作（只执行一次）
            classMemberMapper.batchDeleteMembers(classId, deletableIds);
            classMemberMapper.deleteCheckinRecords(classId, deletableIds);

        }

        // 7. 计算未找到数量
        int unFound = studentIds.size() - existingIds.size();

        return new CMD_Result(
                deletableIds.size(),
                unFound,
                deletableIds
        );
    }

    public List<ClassMemberQuery> queryClassMembers(String classId) {
        // 验证班级存在
        if (classMemberMapper.getClassById(classId) == null) {
            throw new RuntimeException("Class not found");
        }
        return classMemberMapper.getClassStudentsBrief(classId);
    }

    public CMQ_Detail queryStudentDetail(String classId, String userId) {
        // 并行检查班级和用户存在性
        boolean classExists = classMemberMapper.getClassById(classId) != null;
        boolean userExists = classMemberMapper.checkUserExists(userId) != null;

        // 错误处理优先级
        if (!classExists) {
            if (!userExists) {
                throw new RuntimeException("Class not found, User not found");
            }
            throw new RuntimeException("Class not found");
        }

        if (!userExists) {
            throw new RuntimeException("User not found");
        }

        // 检查是否在班级中
        CMQ_Detail detail = classMemberMapper.getStudentDetail(classId, userId);
        if (detail == null) {
            throw new RuntimeException("User not in Class");
        }

        return detail;
    }

    @Transactional
    public ClassMemberDeleteAll deleteAllClassInfo(String classId) {
        // 显式校验班级存在性
        String existingClass = classMemberMapper.getClassById(classId);
        if (existingClass == null || existingClass.isEmpty()) {
            throw new IllegalArgumentException("Class not found");
        }

        // 执行删除操作（保持原有逻辑）
        int checkinRecordsDeleted = classMemberMapper.deleteAllCheckinRecords(classId);
        int membersDeleted = classMemberMapper.deleteAllClassMembers(classId);
        classMemberMapper.deleteClassInfo(classId);

        return new ClassMemberDeleteAll(classId, membersDeleted, checkinRecordsDeleted);
    }
}