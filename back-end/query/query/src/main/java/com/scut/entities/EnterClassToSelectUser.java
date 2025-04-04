package com.scut.entities;
import lombok.Data;

@Data
public class EnterClassToSelectUser {
    private String name;
    private String userId;
    private ECTSU_Summary stats;
}