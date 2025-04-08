package com.example.clock_in.entity.list;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Table(name = "class_member")
@Data
public class ClassMember {
    @EmbeddedId
    private ClassMemberId id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    // 保留同一数据源的关联（ClassInfo属于check_in_list库）
    @ManyToOne
    @JoinColumn(name = "class_id", insertable = false, updatable = false)
    private ClassInfo classInfo;

    // 移除跨数据源的关联，改为存储用户ID（String类型）
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId;  // UserInformation的id是String类型

    // Transient字段：业务层仍可通过getUser()获取对象（需在Service中赋值）
    @Transient
    private com.example.clock_in.entity.users.UserInformation user;

    public enum Role { MANAGER, MEMBER }

    @Embeddable
    @Data
    public static class ClassMemberId implements Serializable {
        @Column(name = "class_id", length = 20)
        private String classId;

        @Column(name = "user_id", length = 20)  // 类型改为String
        private String userId;  // 对应UserInformation的String类型id
    }
}
