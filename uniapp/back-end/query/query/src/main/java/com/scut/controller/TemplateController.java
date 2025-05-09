package com.scut.controller;
import com.scut.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/template")
@RequiredArgsConstructor
public class TemplateController {
    private final TemplateService templateService;

    @GetMapping("/{classId}")
    public ResponseEntity<Map<String, Object>> getLastConfig(@PathVariable String classId) {
        return ResponseEntity.ok(templateService.getLastConfig(classId));
    }
}