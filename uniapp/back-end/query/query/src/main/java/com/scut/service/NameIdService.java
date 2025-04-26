package com.scut.service;

import com.scut.entities.NameIdUser;
import com.scut.entities.NameIdClass;
import com.scut.mapper.NameIdMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NameIdService {
    @Autowired
    private NameIdMapper nameIdMapper;

    public NameIdUser getUserName(String userId) {
        NameIdUser result = nameIdMapper.getUserNameById(userId);
        if (result == null) {
            throw new RuntimeException("User not found");
        }
        return result;
    }

    public NameIdClass getClassName(String classId) {
        NameIdClass result = nameIdMapper.getClassNameById(classId);
        if (result == null || result.getClassName() == null) { // 增加空值判断
            throw new RuntimeException("Class not found");
        }
        return result;
    }
    public String getUserIdByName(String userName) {
        String userId = nameIdMapper.getUserIdByName(userName);
        if (userId == null) {
            throw new RuntimeException("User name not found");
        }
        return userId;
    }

    public String getClassIdByName(String className) {
        String classId = nameIdMapper.getClassIdByName(className);
        if (classId == null) {
            throw new RuntimeException("Class name not found");
        }
        return classId;
    }
}