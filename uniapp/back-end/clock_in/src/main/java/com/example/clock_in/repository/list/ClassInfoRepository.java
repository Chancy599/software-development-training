package com.example.clock_in.repository.list;

import com.example.clock_in.entity.list.ClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassInfoRepository extends JpaRepository<ClassInfo, String> {
}