package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@JsonPropertyOrder({"name", "userId", "in_TIME", "late", "absent", "request_LEAVE", "checkins"})
public class ECTSU_Detail {
    private String name;
    private String userId;
    private Integer in_TIME;
    private Integer late;
    private Integer absent;
    private Integer request_LEAVE;
    private List<CheckinRecord> checkins = new ArrayList<>(); // ✅ 初始化空列表

    @Data
    @JsonPropertyOrder({"startTime", "valid_duration", "actualTime", "state"}) // ✅ 控制顺序
    public static class CheckinRecord {
        private LocalDateTime startTime;
        private Integer valid_duration; // 新增字段
        private LocalDateTime actualTime;
        private String state;
    }
}