// package com.example.demo.model;
// package com.example.demo.model;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;
// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;

// @Document(collection = "messages")
// public class Message {
// @Document(collection = "messages")
// public class Message {

//     @Id
//     private String id;

//     private String content;

//     // Default constructor is required for JSON deserialization
//     public Message() {}

//     public Message(String content) {
//         this.content = content;
//     }

//     // Getters and Setters
//     public String getId() { return id; }
//     public String getContent() { return content; }

//     public void setId(String id) { this.id = id; }
//     public void setContent(String content) { this.content = content; }

//     @Override
//     public String toString() {
//         return "Message{id='" + id + "', content='" + content + "'}";
//     }
// }
