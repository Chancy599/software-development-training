package com.scut.entities;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ECTSR_EnterStartTime {
    private String name;
    private String userId;
    private LocalDateTime startTime;
    private Integer validDuration;
    private LocalDateTime actualTime;
    private String state;
}