//package com.example.clock_in.entity.record;
//
//import com.example.clock_in.entity.list.ClassInfo;
//import com.example.clock_in.entity.users.UserInformation;
//import jakarta.persistence.*;
//import lombok.Data;
//import java.sql.Timestamp;
//
//
//@Entity
//@Table(name = "checkin_record")  //映射到对应数据库表
//@Data
//public class CheckinRecord {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "record_id")
//    private Integer recordId;
//
//    @ManyToOne
//    @JoinColumn(name = "class_id")
//    private ClassInfo classInfo;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private UserInformation user;
//
//    @Column(name = "start_time")
//    private Timestamp startTime;
//
//    @Column(name = "cipher", length = 10)
//    private String checkinCode;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "method")
//    private Method method;
//
//    @Column(name = "actual_time")
//    private Timestamp actualTime;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "state")
//    private State state;
//
//    @Column(name = "valid_duration")
//    private Integer validDuration;
//
//    public enum Method { CIPHER, QRCODE, GPS, FACE_SCAN }
//    public enum State { IN_TIME, LATE, ABSENT, REQUEST_LEAVE }
//}

package com.example.clock_in.entity.record;

import com.example.clock_in.entity.list.ClassInfo;
import com.example.clock_in.entity.users.UserInformation;
import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "check_in_record")
@Data
public class CheckinRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    // 移除跨数据源的JPA关联，改为存储class_id（String类型）
    @Column(name = "class_id", length = 20)
    private String classId;

    // 移除跨数据源的JPA关联，改为存储user_id（String类型）
    @Column(name = "user_id", length = 20)
    private String userId;

    // Transient字段：业务层仍可通过getClassInfo()获取对象（需在Service中赋值）
    @Transient
    private ClassInfo classInfo;

    // Transient字段：业务层仍可通过getUser()获取对象（需在Service中赋值）
    @Transient
    private UserInformation user;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "cipher", length = 10)
    private String checkinCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private Method method;

    @Column(name = "actual_time")
    private Timestamp actualTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private State state;

    @Column(name = "valid_duration")
    private Integer validDuration;

    // 兼容原有代码的getter/setter（确保Service中调用时同步设置ID）
    public ClassInfo getClassInfo() {
        return classInfo;
    }

    public void setClassInfo(ClassInfo classInfo) {
        this.classInfo = classInfo;
        if (classInfo != null) {
            this.classId = classInfo.getId();
        }
    }

    public UserInformation getUser() {
        return user;
    }

    public void setUser(UserInformation user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public enum Method { CIPHER, QRCODE, GPS, FACE_SCAN }
    public enum State { IN_TIME, LATE, ABSENT, REQUEST_LEASE }
}