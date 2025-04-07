package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonPropertyOrder({"name", "userId", "in_TIME", "late", "absent", "request_LEAVE"})
public class EnterClassToSelectUser {
    private String userId;
    private String name;
    private Integer in_TIME;
    private Integer late;
    private Integer absent;
    private Integer request_LEAVE;
}