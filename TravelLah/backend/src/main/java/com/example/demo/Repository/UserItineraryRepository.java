package com.example.demo.Repository;

import com.example.demo.model.UserItinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserItineraryRepository extends MongoRepository<UserItinerary, String> {
    List<UserItinerary> findByItineraryUserId(String userId);
}
