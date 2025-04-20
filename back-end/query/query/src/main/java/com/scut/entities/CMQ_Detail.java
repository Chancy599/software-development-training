package com.scut.entities;

public class CMQ_Detail {
    private String id;
    private String name;
    private String gender;
    private String contactInformation;

    public CMQ_Detail(String id, String name, String gender, String contact) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.contactInformation = contact;
    }

    // Getter
    public String getId() { return id; }
    public String getName() { return name; }
    public String getGender() { return gender; }
    public String getContactInformation() { return contactInformation; }
}