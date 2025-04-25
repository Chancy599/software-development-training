package com.example.clock_in.controller;

import com.example.clock_in.model.enums.CheckinMethod;
import com.example.clock_in.service.CheckinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckinController {
    private final CheckinService checkinService;





    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>>startCheckin(
            @RequestParam String classId,
            @RequestParam CheckinMethod method,
            @RequestParam(required = false) String cipher,
            @RequestParam(required = false) Double longitude,  // 参数名必须为 longitude
            @RequestParam(required = false) Double latitude,     // 参数名必须为 latitude
            @RequestParam int duration) {

        // 收集所有可能参数（无关参数会被策略自动忽略）
        Map<String, Object> params = new HashMap<>();
        params.put("cipher", cipher);
        params.put("longitude", longitude);  // 键名必须为 longitude
        params.put("latitude", latitude);     // 键名必须为 latitude

        Timestamp startTime = checkinService.startCheckinActivity(
                classId, method, params, duration
        );

        // 转换为北京时间字符串
        ZoneId zone = ZoneId.of("Asia/Shanghai");
        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("yyyy-MM-dd HH:mm:ss")
                .withZone(zone);

        String readableTime = formatter.format(startTime.toInstant());

        Map<String, Object> response = new HashMap<>();
        response.put("start_timestamp", readableTime);
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/start")
//    public ResponseEntity<?> startCheckin(
//            @RequestParam String classId,
//            @RequestParam CheckinMethod method,
//            @RequestParam(required = false) String cipher,
//            @RequestParam(required = false) Double longitude,  // 参数名必须为 longitude
//            @RequestParam(required = false) Double latitude,     // 参数名必须为 latitude
//            @RequestParam int duration) {
//
//        // 收集所有可能参数（无关参数会被策略自动忽略）
//        Map<String, Object> params = new HashMap<>();
//        params.put("cipher", cipher);
//        params.put("longitude", longitude);  // 键名必须为 longitude
//        params.put("latitude", latitude);     // 键名必须为 latitude
//
//        checkinService.startCheckinActivity(classId, method, params, duration);
//        return ResponseEntity.ok().build();
//    }












    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyCheckin(
            @RequestParam String userId,
            @RequestParam String classId,
            @RequestParam String code) {
        return ResponseEntity.ok(checkinService.verifyCheckin(userId, classId, code));

    }


}