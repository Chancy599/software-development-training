// EnterClassToSelectCheckInRecord.java
package com.scut.entities;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EnterClassToSelectCheckInRecord {
    private LocalDateTime startTime;  // 签到开始时间
    private String method;            // 签到方式
    private Integer count;            // 该次签到参与人数
}