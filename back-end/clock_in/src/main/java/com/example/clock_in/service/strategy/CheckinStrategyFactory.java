package com.example.clock_in.service.strategy;

import com.example.clock_in.model.enums.CheckinMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class CheckinStrategyFactory {
    private final Map<String, CheckinStrategy> strategyMap;

    public CheckinStrategy getStrategy(CheckinMethod method) {
        return switch (method) {
            case CIPHER -> strategyMap.get("cipherCheckinStrategy");
            case GPS -> strategyMap.get("gpsCheckinStrategy");
            case QRCODE -> strategyMap.get("qrcodeCheckinStrategy");
            case FACE_SCAN -> strategyMap.get("faceScanCheckinStrategy");
            default -> throw new UnsupportedOperationException("未知签到方式");
        };
    }
}