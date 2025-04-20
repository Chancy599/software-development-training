package com.scut.entities;

public class ClassMemberQuery {
    private String id;
    private String name;

    public ClassMemberQuery(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getter
    public String getId() { return id; }
    public String getName() { return name; }
}