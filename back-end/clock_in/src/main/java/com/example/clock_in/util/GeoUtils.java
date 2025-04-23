package com.example.clock_in.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

// 文件路径：src/main/java/com/example/clock_in/util/GeoUtils.java
public class GeoUtils {
    private static final GeometryFactory geometryFactory = new GeometryFactory();

    public static Point createPoint(Double longitude, Double latitude) {
        if (longitude == null || latitude == null) return null;
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }
}