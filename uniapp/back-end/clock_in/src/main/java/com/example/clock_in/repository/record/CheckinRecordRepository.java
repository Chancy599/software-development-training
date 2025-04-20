package com.example.clock_in.repository.record;

import com.example.clock_in.entity.record.CheckinRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckinRecordRepository extends JpaRepository<CheckinRecord, Integer> {
    // 按classId和userId查询（替换原来的关联对象查询）
    List<CheckinRecord> findByClassIdAndUserId(String classId, String userId);
}