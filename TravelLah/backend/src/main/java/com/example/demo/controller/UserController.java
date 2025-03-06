package com.example.demo.controller;

import com.example.demo.Repository.MessageRepository;
import com.example.demo.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired private MessageRepository messageRepository;

  // Handle message from frontend
  @PostMapping
  public ResponseEntity<String> receiveMessage(@RequestBody Message message) {
    logger.info("Received message: {}", message);

    if (message.getContent() == null || message.getContent().isEmpty()) {
      return ResponseEntity.badRequest().body("Content is missing");
    }

    messageRepository.save(message);
    return ResponseEntity.ok("Message received and saved: " + message.getContent());
  }

  // Endpoint to retrieve all messages
  @GetMapping
  public ResponseEntity<?> getAllMessages() {
    return ResponseEntity.ok(messageRepository.findAll());
  }
}
