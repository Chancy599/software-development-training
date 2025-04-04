package com.scut.controller;

import com.scut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/EnterClassToSelectUser")
public class UserController {

    @Autowired
    private UserService userService;

    // 查询班级所有学生统计
    @GetMapping("/{className}")
    public ResponseEntity<?> getClassStudentsStats(@PathVariable String className) {
        try {
            return ResponseEntity.ok(userService.getClassStudentsStats(className));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{className}/{userId}")
    public ResponseEntity<?> getStudentDetails(
            @PathVariable String className,
            @PathVariable String userId
    ) {
        try {
            return ResponseEntity.ok(userService.getStudentDetails(className, userId));
        } catch (RuntimeException e) {
            // 添加空值保护
            String errorMessage = e.getMessage() != null ? e.getMessage() : "未知错误";
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", errorMessage));
        }
    }
}