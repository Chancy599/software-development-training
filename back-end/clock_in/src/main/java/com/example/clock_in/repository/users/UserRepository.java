package com.example.clock_in.repository.users;

import com.example.clock_in.entity.users.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserInformation, String> {
}