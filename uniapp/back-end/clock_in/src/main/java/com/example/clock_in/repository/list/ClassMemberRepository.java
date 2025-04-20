package com.example.clock_in.repository.list;

import com.example.clock_in.entity.list.ClassInfo;
import com.example.clock_in.entity.list.ClassMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



public interface ClassMemberRepository extends JpaRepository<ClassMember, ClassMember.ClassMemberId> {
    List<ClassMember> findByClassInfo(ClassInfo classInfo);
    List<ClassMember> findByIdClassId(String classId);  // 参数为String类型
}