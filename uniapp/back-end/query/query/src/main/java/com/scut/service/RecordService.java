package com.scut.service;
import com.scut.entities.ECTSR_EST_Summary;
import com.scut.entities.ECTSR_EnterStartTime;
import com.scut.entities.EnterClassToSelectRecord;
import com.scut.mapper.RecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecordService {
    @Autowired
    private RecordMapper recordMapper;

    // 修改1: 方法名和参数名
    public List<EnterClassToSelectRecord> getCheckinSummaryByClassId(String classId) {
        return recordMapper.selectCheckinSummaryByClassId(classId);
    }

    // 修改2: 参数名 className -> classId
    public ECTSR_EST_Summary getCheckinsByClassAndTime(String classId, LocalDateTime startTime) {
        ECTSR_EST_Summary summary = recordMapper.selectStats(classId, startTime);
        List<ECTSR_EnterStartTime> records = recordMapper.selectRecords(classId, startTime);
        summary.setRecords(records);
        return summary;
    }
}