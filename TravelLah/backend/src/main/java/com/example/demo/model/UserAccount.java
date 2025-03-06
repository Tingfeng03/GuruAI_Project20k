package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Document(collection = "UserAccount")
public class UserAccount {

    @Id
    private int userAccountId;
    private String username;
    private String passwordHash;

    // A static BCryptPasswordEncoder instance for reuse
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Default constructor is required for JSON deserialization
    public UserAccount() {}

    public UserAccount(String username, String plainTextPassword) {
        this.username = username;
        this.passwordHash = encoder.encode(plainTextPassword);
    }

    // Getters and Setters
    public int getUserAccountId() {
        return userAccountId;
    }

    public void setUserAccountId(int userAccountId) {
        this.userAccountId = userAccountId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String plainTextPassword) {
        this.passwordHash = encoder.encode(plainTextPassword);
    }

    public boolean checkPassword(String plainTextPassword) {
        return encoder.matches(plainTextPassword, this.passwordHash);
    }

    @Override
    public String toString() {
        return "UserAccount{" +
               "userAccountId=" + userAccountId +
               ", username='" + username + '\'' +
               ", passwordHash='" + passwordHash + '\'' +
               '}';
    }
}
