package com.example.clock_in.entity.list;

import com.example.clock_in.entity.users.UserInformation;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "class_info")
@Data
public class ClassInfo {
    @Id
    @Column(name = "class_id", length = 20)
    private String id;

    @Column(name = "class_name", length = 50)
    private String className;

    @Column(name = "manager_id", length = 20)  // 存储用户ID（String类型）
    private String managerId;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Transient字段（业务层仍可访问）
    @Transient
    private UserInformation manager;

    public UserInformation getManager() {
        return manager;
    }

    public void setManager(UserInformation manager) {
        this.manager = manager;
        if (manager != null) {
            this.managerId = manager.getId();
        }
    }
}