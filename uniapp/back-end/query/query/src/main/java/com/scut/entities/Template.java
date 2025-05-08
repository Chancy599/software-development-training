package com.scut.entities;

import jakarta.persistence.*; // 关键修正：Spring Boot 3.x 使用 jakarta.persistence
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in_record")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id")
    private String classId; // 修正字段名

    @Column(name = "start_time")
    private LocalDateTime startTime;

    private String cipher;
    private String location;
    private String method;

    @Column(name = "valid_duration")
    private Integer validDuration;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public String getCipher() { return cipher; }
    public void setCipher(String cipher) { this.cipher = cipher; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public Integer getValidDuration() { return validDuration; }
    public void setValidDuration(Integer validDuration) { this.validDuration = validDuration; }
}