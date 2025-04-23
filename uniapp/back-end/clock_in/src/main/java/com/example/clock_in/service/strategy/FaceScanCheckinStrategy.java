package com.example.clock_in.service.strategy;

import com.example.clock_in.entity.record.CheckinRecord;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class FaceScanCheckinStrategy implements CheckinStrategy {
    @Override
    public void validateParams(Map<String, Object> params) {
        // 无需参数校验
    }

    @Override
    public void enrichRecord(CheckinRecord record, Map<String, Object> params) {
        record.setMethod(CheckinRecord.Method.FACE_SCAN);
        // 可在此添加人脸识别特有逻辑（如关联人脸库ID）
    }
}