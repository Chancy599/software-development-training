package com.scut.entities;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ECTSU_Detail {
    private String userId;
    private String name;
    private List<CheckinRecord> checkins = new ArrayList<>(); // 初始化空列表

    @Data
    public static class CheckinRecord {
        private LocalDateTime startTime;
        private LocalDateTime actualTime;
        private String state;
    }
}