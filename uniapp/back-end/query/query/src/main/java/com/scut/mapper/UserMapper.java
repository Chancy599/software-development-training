package com.scut.mapper;


import com.scut.entities.ECTSU_Detail;
import com.scut.entities.EnterClassToSelectUser;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    // 新增：查询班级总人数
    @Select("SELECT COUNT(*) " +
            "FROM check_in_list.class_member " +
            "WHERE class_id = #{classId} AND role = 'MEMBER'")
    int selectTotalStudents(@Param("classId") String classId);

    // 查询班级所有学生统计（直接使用 class_id）
    @Select("SELECT " +
            "cm.user_id AS userId, " +
            "u.name AS name, " +
            "SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END) AS in_TIME, " +
            "SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END) AS late, " +
            "SUM(CASE WHEN cr.state = 'ABSENT' THEN 1 ELSE 0 END) AS absent, " +
            "SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END) AS request_LEAVE " +
            "FROM check_in_list.class_member cm " +
            "LEFT JOIN check_in_record cr ON cm.user_id = cr.user_id AND cm.class_id = cr.class_id " +  // 添加班级ID关联条件
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = #{classId} AND cm.role = 'MEMBER' " +
            "GROUP BY cm.user_id, u.name")
    @Results({
            @Result(property = "userId", column = "userId"),
            @Result(property = "name", column = "name"),
            @Result(property = "in_TIME", column = "in_TIME"), // ✅ 直接映射到顶层字段
            @Result(property = "late", column = "late"),
            @Result(property = "absent", column = "absent"),
            @Result(property = "request_LEAVE", column = "request_LEAVE")
    })
    List<EnterClassToSelectUser> selectClassStudentsStats(String classId);

    // 查询学生详细签到记录（直接使用 class_id）
    @Select("SELECT " +
            "cr.user_id, " +
            "u.name, " +
            "cr.class_id AS class_id_alias, " + // ✅ 明确添加 class_id 别名
            "COALESCE(SUM(CASE WHEN cr.state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_TIME, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'LATE' THEN 1 ELSE 0 END), 0) AS late, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'ABSENT' THEN 1 ELSE 0 END), 0) AS absent, " +
            "COALESCE(SUM(CASE WHEN cr.state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END), 0) AS request_LEAVE " +
            "FROM check_in_record cr " +
            "JOIN users_information.users_information u ON cr.user_id = u.id " +
            "WHERE cr.user_id = #{userId} AND cr.class_id = #{classId} " +
            "GROUP BY cr.user_id, u.name, cr.class_id") // ✅ 添加 GROUP BY class_id
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "name", column = "name"),
            @Result(property = "in_TIME", column = "in_TIME"),
            @Result(property = "late", column = "late"),
            @Result(property = "absent", column = "absent"),
            @Result(property = "request_LEAVE", column = "request_LEAVE"),
            @Result(property = "checkins", javaType = List.class,
                    column = "{userId=user_id, classId=class_id_alias}", // ✅ 使用别名传递
                    many = @Many(select = "selectCheckinRecords"))
    })
    ECTSU_Detail selectStudentDetails(
            @Param("classId") String classId,
            @Param("userId") String userId
    );

    // 嵌套查询（直接使用 class_id）
    @Select("SELECT " +
            "start_time AS startTime, " +
            "valid_duration, " + // ✅ 新增字段
            "actual_time AS actualTime, " +
            "state " +
            "FROM check_in_record " +
            "WHERE user_id = #{userId} AND class_id = #{classId}")
    @Results({
            @Result(property = "startTime", column = "startTime"),
            @Result(property = "valid_duration", column = "valid_duration"), // ✅ 映射新增字段
            @Result(property = "actualTime", column = "actualTime"),
            @Result(property = "state", column = "state")
    })
    List<ECTSU_Detail.CheckinRecord> selectCheckinRecords(
            @Param("userId") String userId,
            @Param("classId") String classId
    );
}
