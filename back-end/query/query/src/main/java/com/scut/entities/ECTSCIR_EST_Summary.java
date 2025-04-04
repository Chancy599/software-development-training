package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.util.List;

@Data
public class ECTSCIR_EST_Summary {
    private Long IN_TIME;
    private Long REQUEST_LEAVE;
    private Long LATE;
    private Long ABSENT;

    // 添加字段顺序注解
    @JsonPropertyOrder({ "IN_TIME", "REQUEST_LEAVE", "LATE", "ABSENT", "records" })
    private List<ECTSCIR_EnterStartTime> records;
}