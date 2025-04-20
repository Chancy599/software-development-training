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





//        @PostMapping
//        public ResponseEntity<ClassInfo> createClass(
//                @RequestBody ClassCreateRequest request // 接收JSON并自动映射为对象
//) {
//            // 参数提取
//            String managerId = request.getManagerId();
//            String className = request.getClassName();
//            List<String> studentIds = request.getStudentIds();
//        // 调用Service层
//        ClassInfo newClass = classService.createClass(managerId, className, studentIds);
//
//        // 返回201 Created响应
//        return ResponseEntity.created(URI.create("/classes/" + newClass.getClassId()))
//                .body(newClass);
    }
}