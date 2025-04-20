package classtap.face_recognition.Service.impl;

import classtap.face_recognition.Mapper.CheckinRecordMapper;
import classtap.face_recognition.Pojo.CheckinRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class CheckinService {

    @Autowired
    private CheckinRecordMapper checkinRecordMapper;

    public boolean verifyCheckin(String userId, String classId) {
        // 查询签到记录（使用 classId 和 userId）
        List<CheckinRecord> records = checkinRecordMapper.findByClassIdAndUserId(classId, userId);

        // 处理最新记录
        CheckinRecord latestRecord = records.stream()
                .max(Comparator.comparing(CheckinRecord::getStartTime))
                .orElseThrow(() -> new RuntimeException("No active checkin found"));
        int rowsAffected =0;
        if(latestRecord.getState().equals("ABSENT")) {
        // 更新状态
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        System.out.println("原始时间戳: " + currentTime);

        // 将Timestamp转换为Calendar对象，方便进行时间的计算操作
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date(currentTime.getTime()));

        // 给小时数加上8
        calendar.add(Calendar.HOUR_OF_DAY, 8);

        // 从更新后的Calendar对象获取新的时间，再转换回Timestamp
        Timestamp actualTime = new Timestamp(calendar.getTime().getTime());
        latestRecord.setActualTime(actualTime);
        long endTime = latestRecord.getStartTime().getTime() + latestRecord.getValidDuration() * 60000;
        CheckinRecord.State state = actualTime.getTime() <= endTime ?
                CheckinRecord.State.IN_TIME :
                CheckinRecord.State.LATE;
        latestRecord.setState(state.name());

        // 更新数据库中的记录

        System.out.println(latestRecord.getStartTime());
        rowsAffected = checkinRecordMapper.updateRecordState(latestRecord.getId(), latestRecord.getState(), latestRecord.getStartTime(),latestRecord.getActualTime());
        System.out.println(latestRecord.getStartTime());
        }
        return rowsAffected > 0;
    }
}
