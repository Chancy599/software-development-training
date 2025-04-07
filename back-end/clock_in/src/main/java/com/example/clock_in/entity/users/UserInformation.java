package com.example.clock_in.entity.users;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users_information")
@Data
public class UserInformation {
    @Id
    @Column(name = "id", length = 20)
    private String id;

    @Column(name = "name", length = 20)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "password", length = 20)
    private String password;

    @Column(name = "belong_information")
    private String belongInformation;

    @Column(name = "manage_information")
    private String manageInformation;

    @Column(name = "contact_information", length = 20)
    private String contactInformation;

    public enum Gender { MALE, FEMALE }
}