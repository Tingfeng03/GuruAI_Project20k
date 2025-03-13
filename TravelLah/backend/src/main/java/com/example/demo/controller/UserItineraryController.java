// package com.example.demo.controller;

// import com.example.demo.model.UserItinerary;
// import com.example.demo.Repository.UserItineraryRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/itineraries")
// @CrossOrigin(origins = "*")
// public class UserItineraryController {

//     @Autowired
//     private UserItineraryRepository userItineraryRepository;

//     @GetMapping
//     public List<UserItinerary> getAllItineraries() {
//         return userItineraryRepository.findAll();
//     }

//     @GetMapping("/{id}")
//     public Optional<UserItinerary> getItineraryById(@PathVariable String id) {
//         return userItineraryRepository.findById(id);
//     }

//     @GetMapping("/user/{userId}")
//     public List<UserItinerary> getItinerariesByUserId(@PathVariable String userId) {
//         return userItineraryRepository.findByItineraryUserId(userId);
//     }

//     @PostMapping
//     public UserItinerary createItinerary(@RequestBody UserItinerary userItinerary) {
//         return userItineraryRepository.save(userItinerary);
//     }

//     // 5️⃣ Delete an itinerary by ID
//     @DeleteMapping("/{id}")
//     public String deleteItinerary(@PathVariable String id) {
//         userItineraryRepository.deleteById(id);
//         return "Itinerary deleted successfully!";
//     }
// }
