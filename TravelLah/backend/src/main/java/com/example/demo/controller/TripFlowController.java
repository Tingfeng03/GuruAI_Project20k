package com.example.demo.controller;

import com.example.demo.model.TripFlow;
import com.example.demo.Repository.TripFlowRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/TripFlow")
@CrossOrigin(origins = "*")
public class TripFlowController {

    @Autowired
    private TripFlowRepository tripFlowRepository;

    public TripFlowController(TripFlowRepository tripFlowRepository) {
        this.tripFlowRepository = tripFlowRepository;
    }

    @GetMapping("/{serialNo}")
    public List<TripFlow> getTripFlowBySerialNo(@PathVariable String serialNo) {
        return tripFlowRepository.findBySerialNo(serialNo);
    }

}
