package com.scut.mapper;

import com.scut.entities.ClassSchedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ClassScheduleMapper {
    List<ClassSchedule> GetUncheckedList(@Param("userId") String userId);
}
