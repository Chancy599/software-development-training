package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonPropertyOrder({"in_TIME", "late", "absent", "request_LEAVE", "records"})
public class EITSC_Detail {
    private Integer in_TIME;   // IN_TIME 状态次数
    private Integer late;      // LATE 状态次数
    private Integer absent;    // ABSENT 状态次数
    private Integer request_LEAVE; // REQUEST_LEAVE 状态次数
    private List<CheckinRecord> records = new ArrayList<>();

    @Data
    @JsonPropertyOrder({"startTime", "validDuration", "actualTime", "state"})
    public static class CheckinRecord {
        private String startTime;
        private Integer validDuration;
        private String actualTime;
        private String state;
    }
}