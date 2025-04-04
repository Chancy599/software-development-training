package com.scut.entities;

import lombok.Data;
import java.util.List;

@Data
public class EITSC_Summary {
    private int total;
    private List<ClassItem> classes;

    @Data
    public static class ClassItem {
        private String className;

        // 用于反射构造
        public ClassItem() {}

        // 用于手动构建对象
        public ClassItem(String className) {
            this.className = className;
        }
    }
}