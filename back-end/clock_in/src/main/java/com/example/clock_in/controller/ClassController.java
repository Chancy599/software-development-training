package com.example.clock_in.controller;

import com.example.clock_in.entity.list.ClassInfo;
import com.example.clock_in.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ClassInfo> createClass(
            @RequestParam String className,
            @RequestParam String managerId,
            @RequestBody List<String> studentIds) {
        return ResponseEntity.ok(classService.createClass(className, managerId, studentIds));

    }
}