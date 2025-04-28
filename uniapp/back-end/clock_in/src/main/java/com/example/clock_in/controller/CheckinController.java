package com.example.clock_in.controller;

import com.example.clock_in.entity.record.CheckinRecord;
import com.example.clock_in.model.enums.CheckinMethod;
import com.example.clock_in.service.CheckinService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckinController {
    private final CheckinService checkinService;

    @Autowired
    private CheckinService checkinServiceProxy; // 通过代理调用



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





//    @PostMapping("/verify")
//    public ResponseEntity<Boolean> verifyCheckin(
//            @RequestParam String userId,
//            @RequestParam String classId,
//            @RequestParam String code) {
//        return ResponseEntity.ok(checkinService.verifyCheckin(userId, classId, code));
//
//    }
// 统一验证接口
@PostMapping("/verify")
public ResponseEntity<?> verifyCheckin(
        @RequestParam String userId,
        @RequestParam String classId,
        @RequestParam CheckinMethod method ,
        @RequestParam Map<String, String> params) {

    try {
        Map<String, Object> convertedParams = convertParams(params, method);
        boolean result = checkinService.verifyCheckin(userId, classId, method, convertedParams);
        return ResponseEntity.ok(Collections.singletonMap("success", result));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
    }
}

    // 签到提交接口
    @PostMapping("/commit")
    public ResponseEntity<?> commitCheckin(
            @RequestParam String userId,
            @RequestParam String classId) {

        try {
            CheckinRecord record = checkinServiceProxy.commitCheckin(userId, classId);
            return ResponseEntity.ok(buildResult(record));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }



    }

    private Map<String, Object> buildResult(CheckinRecord record) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("recordId", record.getRecordId());
        result.put("state", record.getState().name());
        result.put("actualTime", record.getActualTime());
        return result;
    }

    private Map<String, Object> convertParams(Map<String, String> source, CheckinMethod method) {
        Map<String, Object> target = new HashMap<>();
        switch (method) {
            case CIPHER:
                target.put("cipher", source.get("cipher"));
                break;
            case GPS:
                putGeoParams(target, source);
                break;
        }
        return target;
    }

    private void putGeoParams(Map<String, Object> target, Map<String, String> source) {
        try {
            target.put("longitude", Double.parseDouble(source.get("longitude")));
            target.put("latitude", Double.parseDouble(source.get("latitude")));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("无效的经纬度格式");
        }
    }


}