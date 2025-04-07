package com.scut.service;

import com.scut.entities.ECTSU_Detail;
import com.scut.entities.EnterClassToSelectUser;
import com.scut.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public Map<String, Object> getClassStudentsStats(String classId) {
        // 查询总人数
        int total = userMapper.selectTotalStudents(classId);
        if (total == 0) {
            throw new RuntimeException("班级不存在或没有学生");
        }

        // 查询学生统计列表
        List<EnterClassToSelectUser> students = userMapper.selectClassStudentsStats(classId);

        // 使用 LinkedHashMap 保证字段顺序
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("total", total);
        response.put("students", students);
        return response;
    }

    public ECTSU_Detail getStudentDetails(String classId, String userId) {
        ECTSU_Detail detail = Optional.ofNullable(userMapper.selectStudentDetails(classId, userId))
                .orElseThrow(() -> new RuntimeException("学生不存在"));

        // 确保 checkins 列表不为 null
        if (detail.getCheckins() == null) {
            detail.setCheckins(new ArrayList<>());
        }

        return detail;
    }
}