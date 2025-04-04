package com.scut.service;

import com.scut.entities.ECTSU_Detail;
import com.scut.entities.EnterClassToSelectUser;
import com.scut.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public List<EnterClassToSelectUser> getClassStudentsStats(String className) {
        List<EnterClassToSelectUser> list = userMapper.selectClassStudentsStats(className);
        if (list.isEmpty()) {
            throw new RuntimeException("班级不存在或没有学生");
        }
        return list;
    }


    // UserService.java
    public ECTSU_Detail getStudentDetails(String className, String userId) {
        return Optional.ofNullable(userMapper.selectStudentDetails(className, userId))
                .orElseThrow(() -> new RuntimeException("学生不存在"));
    }
}