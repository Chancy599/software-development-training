package com.scut.service;
import com.scut.entities.ECTSCIR_EST_Summary;
import com.scut.entities.ECTSCIR_EnterStartTime;
import com.scut.entities.EnterClassToSelectCheckInRecord;
import com.scut.mapper.RecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// RecordService.java
@Service
public class RecordService {
    @Autowired
    private RecordMapper recordMapper;

    public List<EnterClassToSelectCheckInRecord> getCheckinSummaryByClassName(String className) {
        return recordMapper.selectCheckinSummaryByClassName(className);
    }

    public ECTSCIR_EST_Summary getCheckinsByClassAndTime(String className, LocalDateTime startTime) {
        // 方法名改为与Controller调用一致
        ECTSCIR_EST_Summary summary = recordMapper.selectStats(className, startTime);
        List<ECTSCIR_EnterStartTime> records = recordMapper.selectRecords(className, startTime);
        summary.setRecords(records);
        return summary;
    }
}