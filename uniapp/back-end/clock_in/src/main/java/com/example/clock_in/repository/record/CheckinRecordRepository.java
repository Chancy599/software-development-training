package com.example.clock_in.repository.record;

import com.example.clock_in.entity.record.CheckinRecord;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface CheckinRecordRepository extends JpaRepository<CheckinRecord, Integer> {
    // 按classId和userId查询（替换原来的关联对象查询）
    List<CheckinRecord> findByClassIdAndUserId(String classId, String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({
            @QueryHint(name = "jakarta.persistence.lock.timeout", value = "2000") // 2秒锁超时
    })
    Optional<CheckinRecord> findTopByClassIdAndUserIdOrderByStartTimeDesc(
            String classId,
            String userId
    );
    @Query("SELECT r FROM CheckinRecord r WHERE r.classId = :classId AND r.userId = :userId AND r.startTime = :startTime")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "2000"))
    Optional<CheckinRecord> findByClassIdAndUserIdAndStartTime(
            @Param("classId") String classId,
            @Param("userId") String userId,
            @Param("startTime") Timestamp startTime);



}