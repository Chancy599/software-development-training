package com.scut.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import java.util.List;

@Data
@JsonPropertyOrder({
        "in_TIME",
        "late",
        "absent",
        "request_LEAVE",
        "records"
})
public class ECTSR_EST_Summary {
    @JsonProperty("in_TIME")
    private Long IN_TIME;

    @JsonProperty("late")
    private Long LATE;

    @JsonProperty("absent")
    private Long ABSENT;

    @JsonProperty("request_LEAVE")
    private Long REQUEST_LEAVE;

    private List<ECTSR_EnterStartTime> records;
}