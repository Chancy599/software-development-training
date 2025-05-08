package com.scut.mapper;

import com.scut.entities.Template; // 必须存在
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TemplateMapper {
    @Select("SELECT * FROM check_in_record WHERE class_id = #{classId} ORDER BY start_time DESC LIMIT 1")
    Template findLatestByClassId(String classId);
}