package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired
  private UserRepository userRepository;

  // Endpoint to register a new user
  @PostMapping("/register")
  public ResponseEntity<String> registerUser(@RequestBody User user) {
    logger.info("Registering user: {}", user);

    if (user.getUsername() == null || user.getUsername().isEmpty()) {
      return ResponseEntity.badRequest().body("Username is missing");
    }
    if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
      return ResponseEntity.badRequest().body("Password is missing");
    }
    User savedUser = userRepository.save(user);
    return ResponseEntity.ok("User registered successfully with id: " + savedUser.getUserId());
  }

  // Endpoint to log in a user
  @PostMapping("/login")
  public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
    logger.info("Login attempt for user: {}", loginRequest.getUsername());

    // Fetch the user from the database by username
    Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());
    if (!optionalUser.isPresent()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    User existingUser = optionalUser.get();
    // Compare the provided plain text password with the stored hashed password
    if (!existingUser.checkPassword(loginRequest.getPasswordHash())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    return ResponseEntity.ok("User login successful for username: " + existingUser.getUsername());
  }

  // Endpoint to retrieve all registered users
  @GetMapping
  public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userRepository.findAll());
  }
}
