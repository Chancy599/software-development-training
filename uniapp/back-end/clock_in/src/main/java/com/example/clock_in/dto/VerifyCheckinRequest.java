// 文件位置：src/main/java/com/yourpackage/dto/VerifyCheckinRequest.java
package com.example.clock_in.dto;

import com.example.clock_in.model.enums.CheckinMethod;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.sql.Timestamp;
import java.util.Map;

public class VerifyCheckinRequest {
    private String userId;
    private String classId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp startTime;

    private CheckinMethod method;
    private Map<String, String> params;

    // 使用Lombok简化（推荐）
    // 如果没有Lombok，需要手动添加getter/setter
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public CheckinMethod getMethod() {
        return method;
    }

    public void setMethod(CheckinMethod method) {
        this.method = method;
    }

    public Map<String, String> getParams() {
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }
}