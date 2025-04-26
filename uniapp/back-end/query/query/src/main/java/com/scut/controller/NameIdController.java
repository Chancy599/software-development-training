package com.scut.controller;

import com.scut.service.NameIdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController

public class NameIdController {
    @Autowired
    private NameIdService nameIdService;

    @GetMapping("/idToName/user/{userId}")
    public ResponseEntity<?> getUserNameById(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(nameIdService.getUserName(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/idToName/class/{classId}")
    public ResponseEntity<?> getClassNameById(@PathVariable String classId) {
        try {
            return ResponseEntity.ok(nameIdService.getClassName(classId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 名称查ID接口
    @GetMapping("/nameToId/user/{userName}")
    public ResponseEntity<?> getUserIdByName(@PathVariable String userName) {
        try {
            return ResponseEntity.ok(
                    Map.of("userId", nameIdService.getUserIdByName(userName))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/nameToId/class/{className}")
    public ResponseEntity<?> getClassIdByName(@PathVariable String className) {
        try {
            return ResponseEntity.ok(
                    Map.of("classId", nameIdService.getClassIdByName(className))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}