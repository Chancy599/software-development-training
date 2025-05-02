// 文件位置：src/main/java/com/yourpackage/dto/CommitCheckinRequest.java
package com.example.clock_in.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.sql.Timestamp;

public class CommitCheckinRequest {
    private String userId;
    private String classId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp startTime;

    // Getter/Setter
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
}