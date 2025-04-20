package com.scut.mapper;

import com.scut.entities.EITSC_Detail;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface IdMapper {

    // 1.查询用户加入的班级名称列表（通过 class_id 关联）
    @Select("SELECT ci.class_name AS className " +
            "FROM check_in_list.class_member cm " +
            "JOIN check_in_list.class_info ci ON cm.class_id = ci.class_id " + // ✅ 重新关联 class_info
            "WHERE cm.user_id = #{userId} AND cm.role = 'MEMBER'")
    List<String> selectJoinedClassNames(@Param("userId") String userId);
    // 2. 查询指定组织的签到详情（通过 class_id 查询）
    @Select("SELECT " +
            "user_id, " +
            "class_id, " +
            "SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END) AS in_TIME, " +
            "SUM(CASE WHEN state = 'LATE' THEN 1 ELSE 0 END) AS late, " +
            "SUM(CASE WHEN state = 'ABSENT' THEN 1 ELSE 0 END) AS absent, " +
            "SUM(CASE WHEN state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END) AS request_LEAVE " +
            "FROM check_in_record " +
            "WHERE user_id = #{userId} AND class_id = #{classId} " +
            "GROUP BY user_id, class_id") // ✅ 添加 GROUP BY
    @Results({
            @Result(property = "in_TIME", column = "in_TIME"),
            @Result(property = "late", column = "late"),
            @Result(property = "absent", column = "absent"),
            @Result(property = "request_LEAVE", column = "request_LEAVE"),
            @Result(property = "records", javaType = List.class,
                    column = "{userId=user_id, classId=class_id}", // ✅ 传递参数
                    many = @Many(select = "selectCheckinDetails"))
    })
    EITSC_Detail selectClassCheckins(
            @Param("userId") String userId,
            @Param("classId") String classId
    );

    // 嵌套查询（直接通过 class_id 查记录）
    @Select("SELECT " +
            "start_time AS startTime, " +
            "valid_duration AS validDuration, " + // ✅ 直接查询数据库字段
            "actual_time AS actualTime, " +
            "state " +
            "FROM check_in_record " +
            "WHERE user_id = #{userId} AND class_id = #{classId}")
    @Results({
            @Result(property = "startTime", column = "startTime"),
            @Result(property = "validDuration", column = "validDuration"), // ✅ 字段映射
            @Result(property = "actualTime", column = "actualTime"),
            @Result(property = "state", column = "state")
    })
    List<EITSC_Detail.CheckinRecord> selectCheckinDetails(
            @Param("userId") String userId,
            @Param("classId") String classId
    );
}