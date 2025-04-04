package com.scut.entities;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class EITSC_Detail {
    private int total = 0; // 该组织签到总次数
    private List<CheckinRecord> records = new ArrayList<>();

    @Data
    public static class CheckinRecord {
        private LocalDateTime startTime;    // 签到开始时间
        private LocalDateTime actualTime;   // 实际签到时间
        private String state;               // 状态: IN_TIME/LATE/ABSENT
    }
}