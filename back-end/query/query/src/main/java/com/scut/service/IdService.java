package com.scut.service;

import com.scut.entities.EITSC_Summary;
import com.scut.entities.EITSC_Detail;
import com.scut.mapper.IdMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IdService {

    @Autowired
    private IdMapper idMapper;

    public EITSC_Summary getJoinedClasses(String userId) {
        List<String> classNames = idMapper.selectJoinedClassNames(userId); // ✅ 方法名改回 selectJoinedClassNames

        EITSC_Summary summary = new EITSC_Summary();
        summary.setTotal(classNames.size());

        // 转换 List<String> 到 List<ClassItem>
        List<EITSC_Summary.ClassItem> items = classNames.stream()
                .map(name -> new EITSC_Summary.ClassItem(name))
                .collect(Collectors.toList());

        summary.setClasses(items);
        return summary;
    }

    public EITSC_Detail getClassCheckins(String userId, String classId) {
        EITSC_Detail detail = idMapper.selectClassCheckins(userId, classId);

        // 检查所有状态是否都为0（无签到记录）
        if (detail.getIn_TIME() == 0
                && detail.getLate() == 0
                && detail.getAbsent() == 0
                && detail.getRequest_LEAVE() == 0) {
            throw new RuntimeException("用户在该班级中没有签到记录");
        }

        return detail;
    }
}