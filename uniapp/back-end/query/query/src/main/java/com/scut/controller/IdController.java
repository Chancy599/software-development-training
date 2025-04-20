package com.scut.controller;


import com.scut.entities.EITSC_Detail;
import com.scut.entities.EITSC_Summary;
import com.scut.service.IdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/EnterIdToSelectClass")
public class IdController {


    @Autowired
    private IdService idService;

    // 查询用户加入的组织列表
    @GetMapping("/{userId}")
    public ResponseEntity<?> getJoinedClasses(@PathVariable String userId) {
        try {
            EITSC_Summary summary = idService.getJoinedClasses(userId);
            return ResponseEntity.ok(summary);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 查询指定组织的签到记录
    @GetMapping("/{userId}/{classId}")
    public ResponseEntity<?> getClassCheckins(
            @PathVariable String userId,
            @PathVariable String classId
    ) {
        try {
            EITSC_Detail detail = idService.getClassCheckins(userId, classId);
            return ResponseEntity.ok(detail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}