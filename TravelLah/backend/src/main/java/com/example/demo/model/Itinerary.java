package com.example.demo.model;

import java.util.List;

import org.springframework.data.annotation.Id;

public class Itinerary {
    @Id
    private String objectId;
    private String userId;
    private String tripSerialNo;
    private String travelLocation;
    private String latitude;
    private String longitude;
    private List<TripFlow> tripFlow;

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

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

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public List<TripFlow> getTripFlow() {
        return tripFlow;
    }

    public void setTripFlow(List<TripFlow> tripFlow) {
        this.tripFlow = tripFlow;
    }
}
