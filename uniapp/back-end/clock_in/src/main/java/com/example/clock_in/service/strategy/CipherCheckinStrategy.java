package com.example.clock_in.service.strategy;


import com.example.clock_in.entity.record.CheckinRecord;
import io.micrometer.common.util.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CipherCheckinStrategy implements CheckinStrategy {
    @Override
    public void validateParams(Map<String, Object> params) {
        if (!params.containsKey("cipher") || StringUtils.isBlank((String) params.get("cipher"))) {
            throw new IllegalArgumentException("密码签到必须提供非空cipher参数");
        }
    }

    @Override
    public void enrichRecord(CheckinRecord record, Map<String, Object> params) {
        record.setCheckinCode((String) params.get("cipher"));  // 设置暗号
        record.setMethod(CheckinRecord.Method.CIPHER);
    }


    @Override
    public boolean verify(CheckinRecord record, Map<String, Object> params) {
        String inputCode = (String) params.get("cipher");
        return inputCode != null && inputCode.equals(record.getCheckinCode());
    }
}