package com.scut.controller;


import com.scut.entities.ECTSR_EST_Summary;
import com.scut.entities.ECTSR_Summary;
import com.scut.entities.EnterClassToSelectRecord;
import com.scut.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/EnterClassToSelectRecord")
public class RecordController {

    private final RecordService recordService;

    @Autowired
    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    // 修改1: 路径参数 {className} -> {classId}
    @GetMapping("/{classId}")
    public ResponseEntity<?> getCheckinSummary(
            @PathVariable String classId) { // 修改2: 参数名 className -> classId
        List<EnterClassToSelectRecord> summaries = recordService.getCheckinSummaryByClassId(classId);

        if (summaries.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "班级ID不存在或没有签到记录")); // 修改3: 错误提示
        }

        ECTSR_Summary response = new ECTSR_Summary();
        response.setTotal(summaries.size());
        response.setRecords(summaries);
        return ResponseEntity.ok(response);
    }

    // 修改4: 路径参数 {className} -> {classId}
    @GetMapping("/{classId}/{startTime}")
    public ResponseEntity<?> getCheckinDetails(
            @PathVariable String classId, // 修改5: 参数名 className -> classId
            @PathVariable String startTime) {

        try {
            LocalDateTime datetime = LocalDateTime.parse(startTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            ECTSR_EST_Summary response = recordService.getCheckinsByClassAndTime(classId, datetime);

            if (response.getRecords() == null || response.getRecords().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message", "未找到签到记录",
                                "stats", Map.of(
                                        "IN_TIME", response.getIN_TIME(),
                                        "LATE", response.getLATE(),
                                        "ABSENT", response.getABSENT()
                                )
                        ));
            }
            return ResponseEntity.ok(response);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "时间格式错误，示例：2025-04-01T15:30:00"));
        }
    }
}