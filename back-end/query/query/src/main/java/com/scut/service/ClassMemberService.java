// ClassMemberService.java
package com.scut.service;

import com.scut.entities.CMA_Result;
import com.scut.entities.CMD_Result;
import com.scut.entities.CMQ_Detail;
import com.scut.entities.ClassMemberQuery;
import com.scut.mapper.ClassMemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;



@Service
public class ClassMemberService {

    @Autowired
    private ClassMemberMapper classMemberMapper;

    @Transactional
    public CMA_Result addStudents(String classId, List<String> studentIds) {
        // 班级存在校验
        if (classMemberMapper.getClassById(classId) == null) {
            throw new RuntimeException("Class not found");
        }
        // 1. 校验用户是否存在
        List<String> existingUsers = !studentIds.isEmpty() ?
                classMemberMapper.checkUsersExist(studentIds) :
                Collections.emptyList();

        List<String> unFoundIds = studentIds.stream()
                .filter(id -> !existingUsers.contains(id))
                .collect(Collectors.toList());

        // 2. 处理有效用户（过滤不存在的ID）
        List<String> validUserIds = studentIds.stream()
                .filter(existingUsers::contains)
                .collect(Collectors.toList());

        // 3. 获取已存在的班级成员（处理空集合）
        List<String> existingMembers = !validUserIds.isEmpty() ?
                classMemberMapper.getExistingMembers(classId, validUserIds) :
                Collections.emptyList();

        // 4. 计算冲突ID（存在于用户表但已加入班级）
        List<String> conflictIds = new ArrayList<>(existingMembers);

        // 5. 实际可添加的ID（有效且未加入班级）
        List<String> finallyAddIds = validUserIds.stream()
                .filter(id -> !existingMembers.contains(id))
                .collect(Collectors.toList());

        // 6. 执行插入
        if (!finallyAddIds.isEmpty()) {
            classMemberMapper.batchInsert(classId, finallyAddIds);
        }

        // 7. 构建结果（确保所有字段都有值）
        return new CMA_Result(
                finallyAddIds.size(),  // 成功添加数
                conflictIds.size(),    // 冲突数量
                unFoundIds.size(),     // 不存在用户数
                conflictIds,           // 冲突ID列表
                unFoundIds             // 不存在ID列表
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

        // 4. 执行删除
        if (!deletableIds.isEmpty()) {
            classMemberMapper.batchDeleteMembers(classId, deletableIds);
            classMemberMapper.deleteCheckinRecords(classId, deletableIds);
        }

        // 5. 计算未找到数量
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
        // 验证班级存在
        if (classMemberMapper.getClassById(classId) == null) {
            throw new RuntimeException("User not found");
        }

        CMQ_Detail detail = classMemberMapper.getStudentDetail(classId, userId);
        if (detail == null) {
            throw new RuntimeException("学生不存在于本班级");
        }
        return detail;
    }
}