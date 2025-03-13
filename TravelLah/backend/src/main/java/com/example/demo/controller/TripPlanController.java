package com.example.demo.controller;

import com.example.demo.model.TripPlan;
import com.example.demo.Repository.TripPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tripplans")
@CrossOrigin(origins = "*")
public class TripPlanController {

    @Autowired
    private TripPlanRepository tripPlanRepository;

    @GetMapping
    public List<TripPlan> getAllPlans() {
        return tripPlanRepository.findAll();
    }

    @GetMapping("/{id}")
    public TripPlan getPlanById(@PathVariable String id) {
        return tripPlanRepository.findById(id).orElse(null);
    }

    @GetMapping("/serial/{serialNo}")
    public TripPlan getPlanBySerial(@PathVariable String serialNo) {
        return tripPlanRepository.findByTripSerialNo(serialNo);
    }

    @PostMapping
    public TripPlan createPlan(@RequestBody TripPlan tripPlan) {
        return tripPlanRepository.save(tripPlan);
    }

    @DeleteMapping("/{id}")
    public String deletePlan(@PathVariable String id) {
        tripPlanRepository.deleteById(id);
        return "Trip Plan deleted successfully!";
    }
}
