package com.scut.mapper;

import com.scut.entities.EITSC_Detail;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface IdMapper {

    // 1. 查询用户加入的组织列表
    @Select("SELECT ci.class_name AS className " +
            "FROM check_in_list.class_member cm " +
            "JOIN check_in_list.class_info ci ON cm.class_id = ci.class_id " +
            "WHERE cm.user_id = #{userId} AND cm.role = 'MEMBER'")
    List<String> selectJoinedClassNames(@Param("userId") String userId);

    // 2. 查询指定组织的签到详情
    @Select("SELECT " +
            "COUNT(*) AS total, " +  // ✅ 使用普通 COUNT 聚合
            "#{userId} AS query_user_id, " +
            "#{className} AS query_class_name " +
            "FROM check_in_record cr " +
            "JOIN check_in_list.class_info ci ON cr.class_id = ci.class_id " +
            "WHERE cr.user_id = #{userId} AND ci.class_name = #{className}")
    @Results({
            @Result(property = "total", column = "total"),
            @Result(property = "records", javaType = List.class,
                    column = "{userId=query_user_id, className=query_class_name}",
                    many = @Many(select = "selectCheckinDetails"))
    })
    EITSC_Detail selectClassCheckins(
            @Param("userId") String userId,
            @Param("className") String className
    );

    // 嵌套查询（实际记录）
    @Select("SELECT " +
            "start_time AS startTime, " +
            "actual_time AS actualTime, " +
            "state " +
            "FROM check_in_record cr " +
            "JOIN check_in_list.class_info ci ON cr.class_id = ci.class_id " +
            "WHERE cr.user_id = #{userId} AND ci.class_name = #{className}")
    List<EITSC_Detail.CheckinRecord> selectCheckinDetails(
            @Param("userId") String userId,
            @Param("className") String className
    );
}