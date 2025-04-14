package com.scut.mapper;

import com.scut.entities.ClassSchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ClassScheduleMapper {
    @Select("SELECT\n" +
            "            t.class_id,\n" +
            "            t.start_time,\n" +
            "            t.method,\n" +
            "            cil.class_name\n" +
            "        FROM (\n" +
            "                 SELECT DISTINCT class_id, start_time, method\n" +
            "                 FROM check_in_record\n" +
            "             ) t\n" +
            "                 LEFT JOIN check_in_list.class_info cil ON CAST(t.class_id AS CHAR) = CAST(cil.class_id AS CHAR)\n" +
            "        WHERE EXISTS (\n" +
            "            SELECT 1\n" +
            "            FROM check_in_record\n" +
            "            WHERE class_id = t.class_id AND start_time = t.start_time AND t.method = method AND user_id = #{userId} AND state = 'ABSENT'\n" +
            "        )")
    List<ClassSchedule> GetUncheckedList(@Param("userId") String userId);
}
