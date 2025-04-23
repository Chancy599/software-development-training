package com.example.clock_in.service.strategy;

import com.example.clock_in.entity.record.CheckinRecord;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class QrcodeCheckinStrategy implements CheckinStrategy {
    @Override
    public void validateParams(Map<String, Object> params) {
        // 无需参数校验
    }

    @Override
    public void enrichRecord(CheckinRecord record, Map<String, Object> params) {
        record.setMethod(CheckinRecord.Method.QRCODE);
        // 可在此生成二维码逻辑（如生成临时二维码URL）
    }
}