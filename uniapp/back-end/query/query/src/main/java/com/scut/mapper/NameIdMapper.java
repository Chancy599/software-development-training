package com.scut.mapper;

import com.scut.entities.NameIdClass;
import com.scut.entities.NameIdUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface NameIdMapper {

    @Select("SELECT id, name FROM users_information.users_information WHERE id = #{userId}") // 增加数据库前缀
    NameIdUser getUserNameById(String userId);

    @Select("SELECT class_id as classId, class_name as className FROM check_in_list.class_info WHERE class_id = #{classId}") // 修正数据库名
    NameIdClass getClassNameById(String classId);

    @Select("SELECT id FROM users_information.users_information WHERE name = #{userName} LIMIT 1") // 增加数据库前缀
    String getUserIdByName(@Param("userName") String userName);

    @Select("SELECT class_id FROM check_in_list.class_info WHERE class_name = #{className} LIMIT 1") // 修正数据库名
    String getClassIdByName(@Param("className") String className);
}