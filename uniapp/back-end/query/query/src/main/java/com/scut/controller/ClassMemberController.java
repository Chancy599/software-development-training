package com.scut.controller;

import com.scut.entities.*;
import com.scut.service.ClassMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/classMember")
public class ClassMemberController {

    @Autowired
    private ClassMemberService classMemberService;

    @PostMapping("/add/{classId}")
    public ResponseEntity<?> addStudentsToClass(
            @PathVariable String classId,
            @RequestBody ClassMemberAdd request) {
        try {
            CMA_Result result = classMemberService.addStudents(classId, request.getStudentIds());
            return ResponseEntity.ok(result); // 自动转换为 JSON
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping(value = "/delete/{classId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteStudents(
            @PathVariable String classId,
            @RequestBody ClassMemberDelete request) {
        try {
            CMD_Result result = classMemberService.deleteStudents(classId, request.getStudentIds());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/query/{classId}")
    public ResponseEntity<?> queryClassMembers(@PathVariable String classId) {
        try {
            List<ClassMemberQuery> result = classMemberService.queryClassMembers(classId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/query/{classId}/{userId}")
    public ResponseEntity<?> queryStudentDetail(
            @PathVariable String classId,
            @PathVariable String userId) {
        try {
            CMQ_Detail detail = classMemberService.queryStudentDetail(classId, userId);
            return ResponseEntity.ok(detail);
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            Map<String, String> response = new HashMap<>();

            // 复合错误处理
            if (errorMessage.contains(",")) {
                response.put("class_error", "Class not found");
                response.put("user_error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // 单一错误处理
            response.put("error", errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/deleteAll/{classId}")
    public ResponseEntity<?> deleteAllClassInfo(@PathVariable String classId) {
        try {
            ClassMemberDeleteAll result = classMemberService.deleteAllClassInfo(classId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Class not found"));
        }
    }
}