package com.scut.entities;

import lombok.Data;

@Data
public class ClassMemberDeleteAll {
    private String deletedClassId;
    private int membersDeleted;
    private int checkinRecordsDeleted;

    // 修改构造函数
    public ClassMemberDeleteAll(String deletedClassId,
                                int membersDeleted,
                                int checkinRecordsDeleted) {
        this.deletedClassId = deletedClassId;
        this.membersDeleted = membersDeleted;
        this.checkinRecordsDeleted = checkinRecordsDeleted;
    }
}