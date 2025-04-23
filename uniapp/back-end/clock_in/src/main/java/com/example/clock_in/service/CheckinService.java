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
import com.example.clock_in.model.enums.CheckinMethod;
import com.example.clock_in.repository.list.ClassInfoRepository;
import com.example.clock_in.repository.list.ClassMemberRepository;
import com.example.clock_in.repository.record.CheckinRecordRepository;
import com.example.clock_in.repository.users.UserRepository;
import com.example.clock_in.service.strategy.CheckinStrategy;
import com.example.clock_in.service.strategy.CheckinStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CheckinService {
    private final CheckinStrategyFactory strategyFactory;
    private final ClassInfoRepository classInfoRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CheckinRecordRepository checkinRecordRepository;
    private final UserRepository userRepository;
    // 使用明确时区生成时间
    private Timestamp getCurrentTimeInUTC8() {
        return Timestamp.from(
                ZonedDateTime.now(ZoneId.of("Asia/Shanghai"))
                        .toInstant()
        );
    }



    //教师发起签到----------------------------------------------------------------------------------------------------
    @Transactional
    public void startCheckinActivity(
            String classId,
            CheckinMethod method,
            Map<String, Object> params,  // 接收所有可能参数
            int duration
    ) {
        // 根据方法选择策略
        CheckinStrategy strategy = strategyFactory.getStrategy(method);

        // === 通用流程 ===
        ClassInfo classInfo = classInfoRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        List<ClassMember> members = classMemberRepository.findByIdClassId(classId);
        Timestamp startTime = getCurrentTimeInUTC8();

        // === 策略专属校验 ===
        strategy.validateParams(params);  // 执行参数校验（仅CIPHER/GPS会实际校验）

        // === 生成记录 ===
        members.stream()
                .filter(member -> member.getRole() == ClassMember.Role.MEMBER)
                .forEach(member -> {
                    CheckinRecord record = createBaseRecord(classId, classInfo, member);
                    strategy.enrichRecord(record, params);  // 设置方法相关字段
                    record.setStartTime(startTime);
                    record.setValidDuration(duration);
                    record.setState(CheckinRecord.State.ABSENT);
                    checkinRecordRepository.save(record);
                });
    }

    private CheckinRecord createBaseRecord(String classId, ClassInfo classInfo, ClassMember member) {
        CheckinRecord record = new CheckinRecord();
        record.setClassId(classId);
        record.setUserId(member.getUserId());
        record.setClassInfo(classInfo);

        // 直接使用 userRepository 查询用户
        record.setUser(
                userRepository.findById(member.getUserId()).orElse(null)
        );

        return record;
    }
//    @Transactional
//    public void startCheckinActivity(String classId, String code, int duration) {
//        // 获取班级信息（仅需classId，无需关联对象）
//        ClassInfo classInfo = classInfoRepository.findById(classId)
//                .orElseThrow(() -> new RuntimeException("Class not found"));
//
//        // 查询班级成员（ClassMember只包含userId，不包含User对象）
//        List<ClassMember> members = classMemberRepository.findByIdClassId(classId);
//
//        // 批量查询用户信息（减少数据库访问）
//        List<String> userIds = members.stream()
//                .map(ClassMember::getUserId)
//                .toList();
//        List<UserInformation> users = userRepository.findAllById(userIds);
//
//        // 生成签到记录
//        // 生成签到记录（已添加角色过滤）
//        Timestamp startTime = getCurrentTimeInUTC8();  // 替换原生成方式
//        members.stream()
//                .filter(member -> member.getRole() == ClassMember.Role.MEMBER)  // 新增过滤条件
//                .forEach(member -> {
//                    CheckinRecord record = new CheckinRecord();
//                    // 保持原有ID直接赋值逻辑
//                    record.setClassId(classId);
//                    record.setUserId(member.getUserId());
//
//                    // 保持原有Transient字段处理
//                    record.setClassInfo(classInfo);
//                    record.setUser(users.stream()
//                            .filter(u -> u.getId().equals(member.getUserId()))
//                            .findFirst()
//                            .orElse(null));
//
//                    // 保持其他字段初始化
//                    record.setStartTime(startTime);
//                    record.setCheckinCode(code);
//                    record.setMethod(CheckinRecord.Method.CIPHER);
//                    record.setState(CheckinRecord.State.ABSENT);
//                    record.setValidDuration(duration);
//                    checkinRecordRepository.save(record);
//                });
//
//    }



    //学生响应签到----------------------------------------------------------------------------------------------------

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
        Timestamp actualTime = getCurrentTimeInUTC8(); // 替换原生成方式
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