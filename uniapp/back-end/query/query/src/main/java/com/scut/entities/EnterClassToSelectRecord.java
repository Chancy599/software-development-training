package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({"startTime", "method", "in_TIME", "late", "absent", "request_LEAVE"})
public class EnterClassToSelectRecord {
    private String startTime;
    private String method;
    private Integer IN_TIME;
    private Integer LATE;
    private Integer ABSENT;
    private Integer REQUEST_LEAVE;
}