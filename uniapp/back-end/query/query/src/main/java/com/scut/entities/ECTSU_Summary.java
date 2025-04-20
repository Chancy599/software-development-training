package com.scut.entities;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonPropertyOrder({"in_TIME", "late", "absent", "request_LEAVE"})
public class ECTSU_Summary {
    private Integer IN_TIME;
    private Integer REQUEST_LEAVE;
    private Integer LATE;
    private Integer ABSENT;
}
