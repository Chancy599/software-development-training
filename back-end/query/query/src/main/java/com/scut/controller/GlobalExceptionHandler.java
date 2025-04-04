package com.scut.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleException(RuntimeException ex) {
        String errorMessage = ex.getMessage() != null ? ex.getMessage() : "未知错误";
        return ResponseEntity.status(404)
                .body(Collections.singletonMap("error", errorMessage)); // ✅ 使用单元素Map
    }
}