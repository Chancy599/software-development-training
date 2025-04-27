package com.example.clock_in.service.strategy;

import com.example.clock_in.entity.record.CheckinRecord;

import java.util.Map;

public interface CheckinStrategy {
    //参数校验
    void validateParams(Map<String, Object> params);

    //补充记录字段
    void enrichRecord(CheckinRecord record, Map<String, Object> params);

    default boolean verify(CheckinRecord record, Map<String, Object> params) {
        return true;
    }
}