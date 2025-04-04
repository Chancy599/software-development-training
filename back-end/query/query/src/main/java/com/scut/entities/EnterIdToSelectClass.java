package com.scut.entities;

import lombok.Data;

@Data
public class EnterIdToSelectClass {
    private String className;  // 组织名称
    private int total;          // 加入的组织总数
}