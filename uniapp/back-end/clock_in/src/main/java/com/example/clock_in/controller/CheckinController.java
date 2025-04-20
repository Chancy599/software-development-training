package com.example.clock_in.controller;

import com.example.clock_in.service.CheckinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
public class CheckinController {
    private final CheckinService checkinService;

    @PostMapping("/start")
    public ResponseEntity<?> startCheckin(
            @RequestParam String classId,
            @RequestParam String code,
            @RequestParam int duration) {
        checkinService.startCheckinActivity(classId, code, duration);
        return ResponseEntity.ok().build();
    }


//    @PostMapping("/start")
//    public CheckinRecord startCheckin(
//            @RequestBody CheckinStartRequest request // 自动绑定JSON参数
//    ) {
//        return checkinService.createCheckinActivity(
//                request.getClassId(),
//                request.getManagerId(),
//                request.getCipherCode(),
//                request.getDurationMinutes()
//        );
//    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyCheckin(
            @RequestParam String userId,
            @RequestParam String classId,
            @RequestParam String code) {
        return ResponseEntity.ok(checkinService.verifyCheckin(userId, classId, code));
    }
}