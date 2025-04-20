package com.scut.controller;

import com.scut.entities.ClassSchedule;
import com.scut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/EnterClassToSelectUser")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{classId}")
    public ResponseEntity<?> getClassStudentsStats(@PathVariable String classId) {
        try {
            return ResponseEntity.ok(userService.getClassStudentsStats(classId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 修改路径参数 {className} -> {classId}
    @GetMapping("/{classId}/{userId}")
    public ResponseEntity<?> getStudentDetails(
            @PathVariable String classId, // ✅ 参数名改为 classId
            @PathVariable String userId
    ) {
        try {
            return ResponseEntity.ok(userService.getStudentDetails(classId, userId));
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "未知错误";
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", errorMessage));
        }
    }

    @GetMapping("/GetUncheckedList")
    public List<ClassSchedule> GetUncheckedList(String userId)
    {
        return userService.GetUncheckedList(userId);
    }
}