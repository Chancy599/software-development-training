package com.scut.entities;

public class ClassSchedule {
    private String classId;
    private String className;
    private String startTime;
    private String method;

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }



    public void setMethod(String method) {
        this.method = method;
    }

    public String getMethod() {
        return method;
    }



    // Getters and Setters
    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
}