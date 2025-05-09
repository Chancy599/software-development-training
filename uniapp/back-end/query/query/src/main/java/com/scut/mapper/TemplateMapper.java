package com.scut.mapper;

import com.scut.entities.Template;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TemplateMapper {
    @Select("SELECT " +
            "method, " +
            "valid_duration, " +
            "ASTEXT(location) AS location " + // MySQL 5.7兼容写法
            "FROM check_in_record " +
            "WHERE class_id = #{classId} " +
            "ORDER BY start_time DESC LIMIT 1")
    Template findLatestByClassId(String classId);
}