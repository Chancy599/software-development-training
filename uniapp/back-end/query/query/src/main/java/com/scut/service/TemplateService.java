package com.scut.service;

import com.scut.entities.Template;
import com.scut.mapper.TemplateMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap; // 关键导入
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TemplateService {
    private final TemplateMapper templateMapper;

    public Map<String, Object> getLastConfig(String classId) {
        Template record = templateMapper.findLatestByClassId(classId);
        Map<String, Object> result = new LinkedHashMap<>();

        boolean exists = record != null;
        result.put("isLastRecordExist", exists);

        // 统一处理字段
        result.put("method", exists ? record.getMethod() : null);
        result.put("cipher", exists ? record.getCipher() : null);
        result.put("location", exists ? record.getLocation() : null);
        result.put("validDuration", exists ? record.getValidDuration() : null);

        return result;
    }
}