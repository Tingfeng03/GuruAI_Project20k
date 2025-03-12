package com.example.demo.model;

import java.util.List;

public class Itinerary {
    private String userId;
    private String tripSerialNo;
    private String travelLocation;
    private double latitude;
    private double longitude;
    private List<TripFlow> tripFlow;

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTripSerialNo() {
        return tripSerialNo;
    }

    public void setTripSerialNo(String tripSerialNo) {
        this.tripSerialNo = tripSerialNo;
    }

    public String getTravelLocation() {
        return travelLocation;
    }

    public void setTravelLocation(String travelLocation) {
        this.travelLocation = travelLocation;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public List<TripFlow> getTripFlow() {
        return tripFlow;
    }

    public void setTripFlow(List<TripFlow> tripFlow) {
        this.tripFlow = tripFlow;
    }
}
