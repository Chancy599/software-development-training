package com.scut.entities;

import java.util.List;

public class CMA_Result {
    private int successAddedCount;
    private int conflictCount;
    private int unFoundCount;
    private List<String> conflictIds;
    private List<String> unFoundIds;

    // 全参构造方法
    public CMA_Result(int successAddedCount, int conflictCount, int unFoundCount,
                      List<String> conflictIds, List<String> unFoundIds) {
        this.successAddedCount = successAddedCount;
        this.conflictCount = conflictCount;
        this.unFoundCount = unFoundCount;
        this.conflictIds = conflictIds;
        this.unFoundIds = unFoundIds;
    }


    public int getUnFoundCount() {
        return unFoundCount;
    }

    public void setUnFoundCount(int unFoundCount) {
        this.unFoundCount = unFoundCount;
    }

    public List<String> getUnFoundIds() {
        return unFoundIds;
    }

    public void setUnFoundIds(List<String> unFoundIds) {
        this.unFoundIds = unFoundIds;
    }

    public int getSuccessAddedCount() {
        return successAddedCount;
    }

    public void setSuccessAddedCount(int successAddedCount) {
        this.successAddedCount = successAddedCount;
    }

    public int getConflictCount() {
        return conflictCount;
    }

    public void setConflictCount(int conflictCount) {
        this.conflictCount = conflictCount;
    }

    public List<String> getConflictIds() {
        return conflictIds;
    }

    public void setConflictIds(List<String> conflictIds) {
        this.conflictIds = conflictIds;
    }

}