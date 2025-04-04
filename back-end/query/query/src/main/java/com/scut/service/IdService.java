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
        List<String> classNames = idMapper.selectJoinedClassNames(userId);

        EITSC_Summary summary = new EITSC_Summary();
        summary.setTotal(classNames.size());

        // 转换 List<String> 到 List<ClassItem>
        List<EITSC_Summary.ClassItem> items = classNames.stream()
                .map(name -> new EITSC_Summary.ClassItem(name))
                .collect(Collectors.toList());

        summary.setClasses(items);
        return summary;
    }

    // 查询指定组织签到详情
    public EITSC_Detail getClassCheckins(String userId, String className) {
        EITSC_Detail detail = idMapper.selectClassCheckins(userId, className);

        // 检查总记录数是否为0
        if (detail.getTotal() == 0) {
            throw new RuntimeException("用户在该组织中没有签到记录");
        }

        return detail;
    }
}