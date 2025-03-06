package com.example.demo.model;

import jakarta.validation.constraints.Pattern;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Document(collection = "User")
public class User {

    @Id
    private String userId;
    private String username;
    private String email;

    // This regex validates phone numbers that may start with a plus and have 10 to
    // 13 digits.
    @Pattern(regexp = "^[0-9]{8,13}$", message = "Invalid phone number")
    private String phone;

    private String passwordHash;
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User() {
    }

    public User(String username, String plainTextPassword) {
        this.username = username;
        this.passwordHash = encoder.encode(plainTextPassword);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        if (phone != null && !phone.matches("^[0-9]{8,13}$")) {
            throw new IllegalArgumentException("Invalid phone number");
        }
        this.phone = phone;
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
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                '}';
    }
}
