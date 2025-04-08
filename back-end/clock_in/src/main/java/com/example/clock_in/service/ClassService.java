//package com.example.clock_in.service;
//
//import com.example.clock_in.entity.list.ClassInfo;
//import com.example.clock_in.entity.list.ClassMember;
//import com.example.clock_in.entity.users.UserInformation;
//import com.example.clock_in.repository.list.ClassInfoRepository;
//import com.example.clock_in.repository.list.ClassMemberRepository;
//import com.example.clock_in.repository.users.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.sql.Timestamp;
//import java.util.List;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class ClassService {
//    private final UserRepository userRepository;
//    private final ClassInfoRepository classInfoRepository;
//    private final ClassMemberRepository classMemberRepository;
//
//    @Transactional
//    public ClassInfo createClass(String className, String managerId, List<String> studentIds) {
//        // 检查教师是否存在
//        UserInformation manager = userRepository.findById(managerId)
//                .orElseThrow(() -> new RuntimeException("Manager not found"));
//
//        // 生成班级ID（根据数据库字段长度限制为20）
//        String classId = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
//
//        // 保存班级信息
//        ClassInfo classInfo = new ClassInfo();
//        classInfo.setId(classId);
//        classInfo.setClassName(className);
//        classInfo.setManager(manager);
//        classInfo.setCreatedAt(new Timestamp(System.currentTimeMillis()));
//        classInfoRepository.save(classInfo);
//
//        // 添加教师为管理员
//        addMember(classId, managerId, ClassMember.Role.MANAGER);
//
//        // 添加学生成员
//        studentIds.forEach(studentId -> addMember(classId, studentId, ClassMember.Role.MEMBER));
//
//        return classInfo;
//    }
//
//    private void addMember(String classId, String userId, ClassMember.Role role) {
//        ClassMember member = new ClassMember();
//        ClassMember.ClassMemberId id = new ClassMember.ClassMemberId();
//        id.setClassId(classId);
//        id.setUserId(userId);
//        member.setId(id);
//        member.setRole(role);
//        classMemberRepository.save(member);
//    }
//
//}
//
package com.example.clock_in.service;

import com.example.clock_in.entity.list.ClassInfo;
import com.example.clock_in.entity.list.ClassMember;
import com.example.clock_in.repository.list.ClassInfoRepository;
import com.example.clock_in.repository.list.ClassMemberRepository;
import com.example.clock_in.repository.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassService {
    private final UserRepository userRepository;
    private final ClassInfoRepository classInfoRepository;
    private final ClassMemberRepository classMemberRepository;

    @Transactional
    public ClassInfo createClass(String className, String managerId, List<String> studentIds) {
        // 验证管理员存在性（不加载完整User对象）
        if (!userRepository.existsById(managerId)) {
            throw new RuntimeException("Manager not found");
        }

        // 生成班级ID
        String classId = UUID.randomUUID().toString().replace("-", "").substring(0, 20);

        // 保存班级信息（只存储managerId）
        ClassInfo classInfo = new ClassInfo();
        classInfo.setId(classId);
        classInfo.setClassName(className);
        classInfo.setManagerId(managerId);  // 直接设置ID，而非关联对象
        classInfo.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        classInfoRepository.save(classInfo);

        // 添加教师为管理员
        addMember(classId, managerId, ClassMember.Role.MANAGER);

        // 批量验证学生存在性
        List<String> notFoundStudents = studentIds.stream()
                .filter(id -> !userRepository.existsById(id))
                .toList();
        if (!notFoundStudents.isEmpty()) {
            throw new RuntimeException("Students not found: " + notFoundStudents);
        }

        // 添加学生成员
        studentIds.forEach(studentId -> addMember(classId, studentId, ClassMember.Role.MEMBER));

        return classInfo;
    }

    private void addMember(String classId, String userId, ClassMember.Role role) {
        // 直接操作ID，无需关联User对象
        ClassMember member = new ClassMember();
        ClassMember.ClassMemberId id = new ClassMember.ClassMemberId();
        id.setClassId(classId);
        id.setUserId(userId);
        member.setId(id);
        member.setRole(role);
        classMemberRepository.save(member);
    }
}
