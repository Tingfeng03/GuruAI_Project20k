package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UserItinerary") // Match your MongoDB collection name
public class UserItinerary {

    @Id
    private String id;
    private Itinerary itinerary;

    public UserItinerary() {
    }

    public UserItinerary(String id, Itinerary itinerary) {
        this.id = id;
        this.itinerary = itinerary;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Itinerary getItinerary() {
        return itinerary;
    }

    public void setItinerary(Itinerary itinerary) {
        this.itinerary = itinerary;
    }
}
