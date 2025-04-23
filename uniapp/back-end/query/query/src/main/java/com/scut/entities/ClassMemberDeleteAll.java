package com.scut.entities;

import lombok.Data;

import java.util.List;

@Data
public class ClassMemberDeleteAll {
    private String deletedClassId;
    private int membersDeleted;          // 仅统计MEMBER角色
    private List<String> deletedClassMemberIds; // 新增字段
    private int checkinRecordsDeleted;

    public ClassMemberDeleteAll(String deletedClassId,
                                List<String> deletedClassMemberIds,
                                int checkinRecordsDeleted) {
        this.deletedClassId = deletedClassId;
        this.membersDeleted = deletedClassMemberIds.size();
        this.deletedClassMemberIds = deletedClassMemberIds;
        this.checkinRecordsDeleted = checkinRecordsDeleted;
    }
}