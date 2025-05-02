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
import com.example.clock_in.model.enums.CheckinMethod;
import com.example.clock_in.repository.list.ClassInfoRepository;
import com.example.clock_in.repository.list.ClassMemberRepository;
import com.example.clock_in.repository.record.CheckinRecordRepository;
import com.example.clock_in.repository.users.UserRepository;
import com.example.clock_in.service.strategy.CheckinStrategy;
import com.example.clock_in.service.strategy.CheckinStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
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
        // 获取当前时间并截断到秒（毫秒置零）
        ZonedDateTime utc8Time = ZonedDateTime.now(ZoneId.of("Asia/Shanghai"))
                .truncatedTo(ChronoUnit.SECONDS); // 关键修改

        return Timestamp.from(utc8Time.toInstant());
    }


    //教师发起签到----------------------------------------------------------------------------------------------------
    @Transactional
    public Timestamp startCheckinActivity(
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


        // === 策略专属校验 ===
        strategy.validateParams(params);  // 执行参数校验（仅CIPHER/GPS会实际校验）



        Timestamp startTime = getCurrentTimeInUTC8();
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
        return startTime;
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










//    // 学生验证签到（验证模块）
//    @Transactional(transactionManager = "recordTransactionManager")//多个表来作实体类的时候一定要对应好啊!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//    public boolean verifyCheckin(
//            String userId,
//            String classId,
//            CheckinMethod method,
//            Map<String, Object> params
//    ) {
//        // 获取最新签到记录
//        CheckinRecord record = checkinRecordRepository
//                .findTopByClassIdAndUserIdOrderByStartTimeDesc(classId, userId)
//                .orElseThrow(() -> new RuntimeException("无有效签到记录"));
//
//        // 获取对应策略
//        CheckinStrategy strategy = strategyFactory.getStrategy(method);
//
//        // 参数校验与验证
//        strategy.validateParams(params);
//        return strategy.verify(record, params);
//    }
//
//
//
//
//
//    //修改数据库中个人的签到状态
//    @Transactional(transactionManager = "recordTransactionManager")  //多个表来作实体类的时候一定要对应好啊!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//    public CheckinRecord commitCheckin(String userId, String classId) {
//        CheckinRecord record = checkinRecordRepository
//                .findTopByClassIdAndUserIdOrderByStartTimeDesc(classId, userId)
//                .orElseThrow(() -> new ResponseStatusException(
//                        HttpStatus.NOT_FOUND, "无有效签到记录"
//                ));
//
//        // 校验是否已提交
//        if (record.getState() != CheckinRecord.State.ABSENT) {
//            throw new ResponseStatusException(
//                    HttpStatus.CONFLICT, "签到已提交"
//            );
//        }
//
//        // 获取数据库当前时间（UTC+8时区）
//        Timestamp dbCurrentTime = getCurrentTimeInUTC8();
//
//        // 计算有效时间范围
//        boolean isValid = validateCheckinTime(record, dbCurrentTime);
//
//        // 更新状态
//        record.setState(isValid ? CheckinRecord.State.IN_TIME : CheckinRecord.State.LATE);
//        record.setActualTime(dbCurrentTime);
//
//        return record; // 自动脏检查更新
//    }


    // 学生验证签到（验证模块）
    @Transactional(transactionManager = "recordTransactionManager")
    public boolean verifyCheckin(
            String userId,
            String classId,
            Timestamp startTime, // 新增参数
            CheckinMethod method,
            Map<String, Object> params
    ) {
        // 根据时间戳查询指定签到记录
        CheckinRecord record = checkinRecordRepository
                .findByClassIdAndUserIdAndStartTime(classId, userId, startTime)
                .orElseThrow(() -> new RuntimeException("未找到指定时间的签到记录"));

        CheckinStrategy strategy = strategyFactory.getStrategy(method);
        strategy.validateParams(params);
        return strategy.verify(record, params);
    }

    // 修改数据库中个人的签到状态
    @Transactional(transactionManager = "recordTransactionManager")
    public CheckinRecord commitCheckin(String userId, String classId, Timestamp startTime) {
        CheckinRecord record = checkinRecordRepository
                .findByClassIdAndUserIdAndStartTime(classId, userId, startTime)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "未找到指定时间的签到记录"
                ));

        if (record.getState() != CheckinRecord.State.ABSENT) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "签到已提交"
            );
        }

        Timestamp dbCurrentTime = getCurrentTimeInUTC8();
        boolean isValid = validateCheckinTime(record, dbCurrentTime);

        record.setState(isValid ? CheckinRecord.State.IN_TIME : CheckinRecord.State.LATE);
        record.setActualTime(dbCurrentTime);

        return record;
    }



    // 独立校验方法
    private boolean validateCheckinTime(CheckinRecord record, Timestamp currentTime) {
        // 转换时间到毫秒级精度
        long startMillis = record.getStartTime().getTime();
        long validMillis = record.getValidDuration() * 60_000L;
        long currentMillis = currentTime.getTime();

        // 防御性校验（防止时间篡改）
        if (currentMillis < startMillis) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "无效签到时间"
            );
        }

        return (currentMillis - startMillis) <= validMillis;
    }

}