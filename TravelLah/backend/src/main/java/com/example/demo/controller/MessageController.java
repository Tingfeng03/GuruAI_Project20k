// // package com.example.demo.controller;
// package com.example.demo.controller;

// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.http.ResponseEntity;
// // import org.springframework.web.bind.annotation.*;
// // import com.example.demo.model.Message;
// // import com.example.demo.Repository.MessageRepository;
// // import org.slf4j.Logger;
// // import org.slf4j.LoggerFactory;

// @RestController
// @RequestMapping("/api/messages")
// @CrossOrigin(origins = "*")
// public class MessageController {

//     private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

//     @Autowired
//     private MessageRepository messageRepository;

//     // Handle message from frontend
//     @PostMapping
//     public ResponseEntity<String> receiveMessage(@RequestBody Message message) {
//         logger.info("Received message: {}", message);
        
//         if (message.getContent() == null || message.getContent().isEmpty()) {
//             return ResponseEntity.badRequest().body("Content is missing");
//         }

//         messageRepository.save(message);
//         return ResponseEntity.ok("Message received and saved: " + message.getContent());
//     }

//     // Endpoint to retrieve all messages
//     @GetMapping
//     public ResponseEntity<?> getAllMessages() {
//         return ResponseEntity.ok(messageRepository.findAll());
//     }
// }
