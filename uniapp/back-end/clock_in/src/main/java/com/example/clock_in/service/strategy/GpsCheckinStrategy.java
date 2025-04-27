package com.example.clock_in.service.strategy;

import com.example.clock_in.entity.record.CheckinRecord;
import com.example.clock_in.util.GeoUtils;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GpsCheckinStrategy implements CheckinStrategy {

    private static final double EARTH_RADIUS = 6371e3; // 米

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


    @Override
    public boolean verify(CheckinRecord record, Map<String, Object> params) {
        // 参数解析
        Double longitude = parseDouble(params.get("longitude"));
        Double latitude = parseDouble(params.get("latitude"));
        Point targetPoint = record.getLocation();

        // 空值校验
        if (longitude == null || latitude == null || targetPoint == null) {
            return false;
        }

        // 从Point对象获取坐标
        double targetLon = targetPoint.getX();
        double targetLat = targetPoint.getY();

        // 计算距离（Haversine公式）
        double φ1 = Math.toRadians(latitude);
        double φ2 = Math.toRadians(targetLat);
        double Δφ = Math.toRadians(targetLat - latitude);
        double Δλ = Math.toRadians(targetLon - longitude);

        double a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return (EARTH_RADIUS * c) <= 500; // 500米范围内
    }

    private Double parseDouble(Object value) {
        try {
            return Double.parseDouble(value.toString());
        } catch (Exception e) {
            return null;
        }
    }
}