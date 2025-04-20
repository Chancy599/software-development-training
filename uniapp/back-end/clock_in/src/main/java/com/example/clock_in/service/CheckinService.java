//package com.example.clock_in.service;
//
//import com.example.clock_in.entity.list.ClassInfo;
//import com.example.clock_in.entity.list.ClassMember;
//import com.example.clock_in.entity.record.CheckinRecord;
//import com.example.clock_in.entity.users.UserInformation;
//import com.example.clock_in.repository.record.CheckinRecordRepository;
//import com.example.clock_in.repository.list.ClassInfoRepository;
//import com.example.clock_in.repository.list.ClassMemberRepository;
//import com.example.clock_in.repository.users.UserRepository;
//
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.sql.Timestamp;
//import java.util.Comparator;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class CheckinService {
//    private final ClassInfoRepository classInfoRepository;
//    private final ClassMemberRepository classMemberRepository;
//    private final CheckinRecordRepository checkinRecordRepository;
//    private final UserRepository userRepository;
//
//    @Transactional
//    public void startCheckinActivity(String classId, String code, int duration) {
//        ClassInfo classInfo = classInfoRepository.findById(classId)
//                .orElseThrow(() -> new RuntimeException("Class not found"));
//
//        // 获取所有班级成员
//        List<ClassMember> members = classMemberRepository.findByClassInfo(classInfo);
//
//        // 为每个成员生成初始签到记录,要注意这里不能将manager给写到第三个数据库之中
//        Timestamp startTime = new Timestamp(System.currentTimeMillis());
//        members.stream()
//                .filter(member -> member.getRole() == ClassMember.Role.MEMBER)
//                .forEach(member -> {
//                    CheckinRecord record = new CheckinRecord();
//                    record.setClassInfo(classInfo);
//                    record.setUser(member.getUser());
//                    record.setStartTime(startTime);
//                    record.setCheckinCode(code);
//                    record.setMethod(CheckinRecord.Method.CIPHER);
//                    record.setState(CheckinRecord.State.ABSENT);
//                    record.setValidDuration(duration);
//                    checkinRecordRepository.save(record);
//                });
////        members.forEach(member -> {
////            CheckinRecord record = new CheckinRecord();
////            record.setClassInfo(classInfo);
////            record.setUser(member.getUser());
////            record.setStartTime(startTime);
////            record.setCheckinCode(code);
////            record.setMethod(CheckinRecord.Method.CIPHER);
////            record.setState(CheckinRecord.State.ABSENT);
////            record.setValidDuration(duration);
////            checkinRecordRepository.save(record);
////        });
//
//    }
//
//    @Transactional
//    public boolean verifyCheckin(String userId, String classId, String code) {
//        UserInformation user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        ClassInfo classInfo = classInfoRepository.findById(classId)
//                .orElseThrow(() -> new RuntimeException("Class not found"));
//
//        // 查找用户最近的签到记录
//        List<CheckinRecord> records = checkinRecordRepository.findByClassInfoAndUser(classInfo, user);
//        CheckinRecord latestRecord = records.stream()
//                .max(Comparator.comparing(CheckinRecord::getStartTime))
//                .orElseThrow(() -> new RuntimeException("No active checkin found"));
//
//        // 验证暗号
//        if (!latestRecord.getCheckinCode().equals(code)) {
//            return false;
//        }
//
//        // 更新实际签到时间
//        Timestamp actualTime = new Timestamp(System.currentTimeMillis());
//        latestRecord.setActualTime(actualTime);
//
//        // 计算签到状态(是否迟到)
//        long endTime = latestRecord.getStartTime().getTime() + latestRecord.getValidDuration() * 60000;
//        if (actualTime.getTime() <= endTime) {
//            latestRecord.setState(CheckinRecord.State.IN_TIME);
//        } else {
//            latestRecord.setState(CheckinRecord.State.LATE);
//        }
//
//        checkinRecordRepository.save(latestRecord);
//        return true;
//    }
//}

package com.example.clock_in.service;

import com.example.clock_in.entity.list.ClassInfo;
import com.example.clock_in.entity.list.ClassMember;
import com.example.clock_in.entity.record.CheckinRecord;
import com.example.clock_in.entity.users.UserInformation;
import com.example.clock_in.repository.record.CheckinRecordRepository;
import com.example.clock_in.repository.list.ClassInfoRepository;
import com.example.clock_in.repository.list.ClassMemberRepository;
import com.example.clock_in.repository.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckinService {
    private final ClassInfoRepository classInfoRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CheckinRecordRepository checkinRecordRepository;
    private final UserRepository userRepository;

    @Transactional
    public void startCheckinActivity(String classId, String code, int duration) {
        // 获取班级信息（仅需classId，无需关联对象）
        ClassInfo classInfo = classInfoRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // 查询班级成员（ClassMember只包含userId，不包含User对象）
        List<ClassMember> members = classMemberRepository.findByIdClassId(classId);

        // 批量查询用户信息（减少数据库访问）
        List<String> userIds = members.stream()
                .map(ClassMember::getUserId)
                .toList();
        List<UserInformation> users = userRepository.findAllById(userIds);

        // 生成签到记录
        // 生成签到记录（已添加角色过滤）
        Timestamp startTime = new Timestamp(System.currentTimeMillis());
        members.stream()
                .filter(member -> member.getRole() == ClassMember.Role.MEMBER)  // 新增过滤条件
                .forEach(member -> {
                    CheckinRecord record = new CheckinRecord();
                    // 保持原有ID直接赋值逻辑
                    record.setClassId(classId);
                    record.setUserId(member.getUserId());

                    // 保持原有Transient字段处理
                    record.setClassInfo(classInfo);
                    record.setUser(users.stream()
                            .filter(u -> u.getId().equals(member.getUserId()))
                            .findFirst()
                            .orElse(null));

                    // 保持其他字段初始化
                    record.setStartTime(startTime);
                    record.setCheckinCode(code);
                    record.setMethod(CheckinRecord.Method.CIPHER);
                    record.setState(CheckinRecord.State.ABSENT);
                    record.setValidDuration(duration);
                    checkinRecordRepository.save(record);
                });
//        Timestamp startTime = new Timestamp(System.currentTimeMillis());
//        members.forEach(member -> {
//            CheckinRecord record = new CheckinRecord();
//            // 设置ID而非关联对象
//            record.setClassId(classId);  // 直接设置classId
//            record.setUserId(member.getUserId());  // 直接设置userId
//
//            // 兼容原有代码（Transient字段可忽略）
//            record.setClassInfo(classInfo);  // 自动同步classId（如果有需要）
//            record.setUser(users.stream()
//                    .filter(u -> u.getId().equals(member.getUserId()))
//                    .findFirst()
//                    .orElse(null));  // 设置Transient的user对象
//
//            // 其他字段初始化
//            record.setStartTime(startTime);
//            record.setCheckinCode(code);
//            record.setMethod(CheckinRecord.Method.CIPHER);
//            record.setState(CheckinRecord.State.ABSENT);
//            record.setValidDuration(duration);
//            checkinRecordRepository.save(record);
//        });
    }

    @Transactional
    public boolean verifyCheckin(String userId, String classId, String code) {
        // 直接使用ID查询用户和班级（无需关联对象）
        UserInformation user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 查询签到记录（使用classId和userId）
        List<CheckinRecord> records = checkinRecordRepository.findByClassIdAndUserId(classId, userId);

        // 处理最新记录
        CheckinRecord latestRecord = records.stream()
                .max(Comparator.comparing(CheckinRecord::getStartTime))
                .orElseThrow(() -> new RuntimeException("No active checkin found"));

        // 验证暗号
        if (!latestRecord.getCheckinCode().equals(code)) {
            return false;
        }

        // 更新状态
        Timestamp actualTime = new Timestamp(System.currentTimeMillis());
        latestRecord.setActualTime(actualTime);

        long endTime = latestRecord.getStartTime().getTime() + latestRecord.getValidDuration() * 60000;
        latestRecord.setState(
                actualTime.getTime() <= endTime ?
                        CheckinRecord.State.IN_TIME :
                        CheckinRecord.State.LATE
        );

        checkinRecordRepository.save(latestRecord);
        return true;
    }
}