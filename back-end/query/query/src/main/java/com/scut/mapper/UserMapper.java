package com.scut.mapper;

import com.scut.entities.EnterClassToSelectUser;
import com.scut.entities.ECTSU_Detail;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    // 查询班级所有学生统计（保持不变）
    @Select("SELECT " +
            "u.name, cm.user_id, " +
            "SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END) AS IN_TIME, " +
            "SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END) AS REQUEST_LEAVE, " +
            "SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END) AS LATE, " +
            "SUM(CASE WHEN cr.state IS NULL THEN 1 ELSE 0 END) AS ABSENT " +
            "FROM check_in_list.class_member cm " +
            "LEFT JOIN check_in_record cr ON cm.user_id = cr.user_id " +
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className}) " +
            "AND cm.role = 'MEMBER' " +
            "GROUP BY cm.user_id, u.name")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "name", column = "name"),
            @Result(property = "stats.IN_TIME", column = "IN_TIME"),
            @Result(property = "stats.REQUEST_LEAVE", column = "REQUEST_LEAVE"),
            @Result(property = "stats.LATE", column = "LATE"),
            @Result(property = "stats.ABSENT", column = "ABSENT")
    })
    List<EnterClassToSelectUser> selectClassStudentsStats(String className);

    // 查询学生详细签到记录（关键修复）
    @Select("SELECT DISTINCT " +
            "cr.user_id, " +
            "u.name, " +
            "#{className} AS query_class_name " +
            "FROM check_in_record cr " +
            "JOIN users_information.users_information u ON cr.user_id = u.id " +
            "JOIN check_in_list.class_member cm ON cr.user_id = cm.user_id " +
            "WHERE cr.user_id = #{userId} " +
            "AND cm.class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className})")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "name", column = "name"),
            @Result(property = "checkins", javaType = List.class,
                    column = "{userId=user_id, className=query_class_name}",
                    many = @Many(select = "selectCheckinRecords"))
    })
    ECTSU_Detail selectStudentDetails(
            @Param("className") String className,
            @Param("userId") String userId
    );

    // 嵌套查询（签到记录）
    @Select("SELECT " +
            "start_time AS startTime, " +
            "actual_time AS actualTime, " +
            "state " +
            "FROM check_in_record " +
            "WHERE user_id = #{userId} " +
            "AND class_id = (SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className})")
    @Results(id = "checkinRecordMap", value = {
            @Result(property = "startTime", column = "startTime"),
            @Result(property = "actualTime", column = "actualTime"),
            @Result(property = "state", column = "state")
    })
    List<ECTSU_Detail.CheckinRecord> selectCheckinRecords(
            @Param("userId") String userId,
            @Param("className") String className
    );
}
