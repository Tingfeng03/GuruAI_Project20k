package com.example.demo.Repository;

import com.example.demo.model.TripPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripPlanRepository extends MongoRepository<TripPlan, String> {
    TripPlan findByTripSerialNo(String tripSerialNo);
}
