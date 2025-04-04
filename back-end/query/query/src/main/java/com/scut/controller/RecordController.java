package com.scut.controller;
import com.scut.entities.ECTSCIR_EST_Summary;
import com.scut.entities.EnterClassToSelectCheckInRecord;
import com.scut.entities.ECTSCIR_Summary;
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

// CheckinController.java
@RestController
@RequestMapping("/EnterClassToSelectCheckInRecord")
public class RecordController {

    private final RecordService recordService;

    @Autowired
    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }


    //##################################################################################################
    @GetMapping("/{className}")
    public ResponseEntity<?> getCheckinSummary(
            @PathVariable String className) {
        List<EnterClassToSelectCheckInRecord> summaries = recordService.getCheckinSummaryByClassName(className);

        if (summaries.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "班级不存在或没有签到记录"));
        }

        // 包装响应对象
        ECTSCIR_Summary response = new ECTSCIR_Summary();
        response.setTotal(summaries.size());  // 总次数 = 列表长度
        response.setRecords(summaries);


        return ResponseEntity.ok(response);
    }


    //##################################################################################################
    @GetMapping("/{className}/{startTime}")
    public ResponseEntity<?> getCheckinDetails(
            @PathVariable String className,
            @PathVariable String startTime) {

        try {
            LocalDateTime datetime = LocalDateTime.parse(startTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            ECTSCIR_EST_Summary response = recordService.getCheckinsByClassAndTime(className, datetime);

            // 优化空记录判断逻辑
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

//##################################################################################################

