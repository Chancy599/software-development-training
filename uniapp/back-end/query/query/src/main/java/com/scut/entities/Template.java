package com.scut.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in_record")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id")
    private String classId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    private String method;

    // 修改核心字段：存储WKT格式字符串
    @Column(columnDefinition = "text") // 映射MySQL的TEXT类型
    private String location;  // 存储格式示例：POINT(113.34 23.12)

    @Column(name = "valid_duration")
    private Integer validDuration;

    // 移除单独的latitude/longitude字段
    // 增加解析方法（不需要持久化到数据库）

    public Double getLongitude() {
        return parsePoint()[0];
    }

    public Double getLatitude() {
        return parsePoint()[1];
    }

    private Double[] parsePoint() {
        if (this.location == null || !location.startsWith("POINT")) {
            return new Double[]{null, null};
        }

        try {
            // 解析WKT格式：POINT(经度 纬度)
            String cleanStr = location.replace("POINT(", "").replace(")", "");
            String[] parts = cleanStr.split(" ");
            return new Double[]{
                    Double.parseDouble(parts[0]), // 经度
                    Double.parseDouble(parts[1])  // 纬度
            };
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid location format: " + location);
        }
    }

    // 保留其他getter/setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getValidDuration() {
        return validDuration;
    }

    public void setValidDuration(Integer validDuration) {
        this.validDuration = validDuration;
    }
}