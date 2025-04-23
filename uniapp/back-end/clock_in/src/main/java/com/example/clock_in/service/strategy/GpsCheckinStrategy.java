package com.example.clock_in.service.strategy;

import com.example.clock_in.entity.record.CheckinRecord;
import com.example.clock_in.util.GeoUtils;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GpsCheckinStrategy implements CheckinStrategy {
    @Override
    public void validateParams(Map<String, Object> params) {
        if (!params.containsKey("longitude") || !params.containsKey("latitude")) {
            throw new IllegalArgumentException("GPS签到必须提供经纬度参数");
        }
        // 新增空值校验
        if (params.get("longitude") == null || params.get("latitude") == null) {
            throw new IllegalArgumentException("经纬度参数不能为空");
        }
    }

    @Override
    public void enrichRecord(CheckinRecord record, Map<String, Object> params) {
        Double longitude = (Double) params.get("longitude");
        Double latitude = (Double) params.get("latitude");
        // 添加防御性空值检查
        if (longitude == null || latitude == null) {
            throw new IllegalStateException("经纬度参数解析失败");
        }
        Point location = GeoUtils.createPoint(longitude, latitude);
        record.setLocation(location);
        record.setMethod(CheckinRecord.Method.GPS);
    }
}