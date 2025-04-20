// CMD_Result.java
package com.scut.entities;

import java.util.List;

public class CMD_Result {
    private int successDeletedCount;
    private int unFoundCount;
    private List<String> DeletedIds;

    // 全参构造方法
    public CMD_Result(int successDeletedCount,
                      int unFoundCount,
                      List<String> DeletedIds) {
        this.successDeletedCount = successDeletedCount;
        this.unFoundCount = unFoundCount;
        this.DeletedIds = DeletedIds;
    }
    public int getSuccessDeletedCount() { return successDeletedCount; }
    public int getUnFoundCount() { return unFoundCount; }
    public List<String> getDeletedIds() { return DeletedIds; }
}