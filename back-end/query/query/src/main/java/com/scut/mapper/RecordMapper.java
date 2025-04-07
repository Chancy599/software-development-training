package com.scut.mapper;
import com.scut.entities.ECTSR_EST_Summary;
import com.scut.entities.ECTSR_EnterStartTime;
import com.scut.entities.EnterClassToSelectRecord;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface RecordMapper {
    // 修改1: 方法名和SQL
    @Select("SELECT \n" +
            "    cr.start_time AS startTime,\n" +
            "    cr.method AS method,\n" +
            "    SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END) AS IN_TIME,\n" +
            "    SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END) AS REQUEST_LEAVE,\n" +
            "    SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END) AS LATE,\n" +
            "    SUM(CASE WHEN cr.state = 'ABSENT' THEN 1 ELSE 0 END) AS ABSENT  -- ✅ 直接统计 ABSENT 状态\n" +
            "FROM \n" +
            "    check_in_record cr\n" +
            "WHERE \n" +
            "    cr.class_id = #{classId}\n" +
            "GROUP BY \n" +
            "    cr.start_time, cr.method")
    @Results({
            @Result(property = "startTime", column = "startTime"),
            @Result(property = "method", column = "method"),
            @Result(property = "IN_TIME", column = "IN_TIME"),
            @Result(property = "REQUEST_LEAVE", column = "REQUEST_LEAVE"),
            @Result(property = "LATE", column = "LATE"),
            @Result(property = "ABSENT", column = "ABSENT")
    })
    List<EnterClassToSelectRecord> selectCheckinSummaryByClassId(String classId);

    // 修改2: SQL中使用class_id
    @Select("SELECT " +
            "COALESCE(SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS IN_TIME, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END), 0) AS LATE, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'ABSENT' THEN 1 ELSE 0 END), 0) AS ABSENT, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END), 0) AS REQUEST_LEAVE " +
            "FROM check_in_record cr " +
            "WHERE cr.class_id = #{classId} " +
            "AND cr.start_time = #{startTime}")
    @Results({
            @Result(property = "IN_TIME", column = "IN_TIME"),
            @Result(property = "LATE", column = "LATE"),
            @Result(property = "ABSENT", column = "ABSENT"),
            @Result(property = "REQUEST_LEAVE", column = "REQUEST_LEAVE")
    })
    ECTSR_EST_Summary selectStats(@Param("classId") String classId, @Param("startTime") LocalDateTime startTime);
    // 修改3: SQL中移除class_name相关查询
    @Select("SELECT u.name, cm.user_id, " +
            "#{startTime} AS start_time, " +
            "cr.valid_duration, cr.actual_time, " +
            "COALESCE(cr.state, 'ABSENT') AS state " +
            "FROM check_in_list.class_member cm " +
            "LEFT JOIN check_in_record cr ON cm.user_id = cr.user_id " +
            "  AND cr.start_time = #{startTime} " +
            "  AND cr.class_id = #{classId} " + // 直接使用classId参数
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = #{classId} " + // 直接通过class_id查询
            "AND cm.role = 'MEMBER' " +
            "ORDER BY CASE COALESCE(cr.state, 'ABSENT') " +
            "  WHEN 'IN_TIME' THEN 1 " +
            "  WHEN 'REQUEST_LEAVE' THEN 2 " +
            "  WHEN 'LATE' THEN 3 " +
            "  ELSE 4 END")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "startTime", column = "start_time"),
            @Result(property = "validDuration", column = "valid_duration"),
            @Result(property = "actualTime", column = "actual_time")
    })
    List<ECTSR_EnterStartTime> selectRecords(@Param("classId") String classId, // 参数名修改
                                             @Param("startTime") LocalDateTime startTime);
}