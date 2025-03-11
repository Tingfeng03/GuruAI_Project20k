package com.example.demo.controller;

import com.example.demo.model.TripPlan;
import com.example.demo.Repository.TripPlanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/TripPlan")
@CrossOrigin(origins = "*")
public class TripPlanController {

    @Autowired
    private TripPlanRepository tripPlanRepository;

    public TripPlanController(TripPlanRepository tripPlanRepository) {
        this.tripPlanRepository = tripPlanRepository;
    }

    @GetMapping
    public List<TripPlan> getAllTripPlans() {
        return tripPlanRepository.findAll();
    }
}
