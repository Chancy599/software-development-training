// CheckinSummaryResponse.java
package com.scut.entities;

import lombok.Data;
import java.util.List;

@Data
public class ECTSCIR_Summary {
    private int total;  // 新增总签到次数
    private List<EnterClassToSelectCheckInRecord> records;  // 原有记录列表
}