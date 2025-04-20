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

        public ClassItem(String classId) {
            this.className = classId;
        }
    }
}