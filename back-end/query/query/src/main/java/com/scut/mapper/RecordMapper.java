package com.scut.mapper;
import com.scut.entities.ECTSCIR_EST_Summary;
import com.scut.entities.ECTSCIR_EnterStartTime;
import com.scut.entities.EnterClassToSelectCheckInRecord;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface RecordMapper {
    // 根据班级名称查询签到统计
    //查询格式("/{className}")
    @Select("SELECT cr.start_time AS startTime, cr.method AS method, COUNT(cr.record_id) AS count " +
            "FROM check_in_record cr " +
            "JOIN check_in_list.class_info ci ON cr.class_id = ci.class_id " +
            "WHERE ci.class_name = #{className} " +
            "GROUP BY cr.start_time, cr.method")
    List<EnterClassToSelectCheckInRecord> selectCheckinSummaryByClassName(String className);


//##################################################################################################
    // 先根据班级名称查询签到统计，再输入签到开始时间
    //("/{className}/{startTime}")
    @Select("SELECT " +
            "COALESCE(SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS IN_TIME, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END), 0) AS REQUEST_LEAVE, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END), 0) AS LATE, " +
            "COALESCE( " +
            "  (SELECT COUNT(*) FROM check_in_list.class_member " +
            "   WHERE class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className}) " +
            "   AND role = 'MEMBER') - COUNT(DISTINCT cr.user_id), 0 " +
            ") AS ABSENT " +
            "FROM check_in_record cr " +
            "JOIN check_in_list.class_info ci ON cr.class_id = ci.class_id " +
            "WHERE ci.class_name = #{className} " +
            "AND cr.start_time = #{startTime}")
    @Results({
            @Result(property = "IN_TIME", column = "IN_TIME"),
            @Result(property = "REQUEST_LEAVE", column = "REQUEST_LEAVE"),
            @Result(property = "LATE", column = "LATE"),
            @Result(property = "ABSENT", column = "ABSENT")
    })
    ECTSCIR_EST_Summary selectStats(@Param("className") String className,
                                    @Param("startTime") LocalDateTime startTime);

    // 记录查询（新增排序逻辑）
    @Select("SELECT u.name, cm.user_id, " +
            "#{startTime} AS start_time, " +
            "cr.valid_duration, cr.actual_time, " +
            "COALESCE(cr.state, 'ABSENT') AS state " +
            "FROM check_in_list.class_member cm " +
            "LEFT JOIN check_in_record cr ON cm.user_id = cr.user_id " +
            "  AND cr.start_time = #{startTime} " +
            "  AND cr.class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className}) " +
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className}) " +
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
    List<ECTSCIR_EnterStartTime> selectRecords(@Param("className") String className,
                                               @Param("startTime") LocalDateTime startTime);
}

//##################################################################################################