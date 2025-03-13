package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "UserItinerary")
public class TripPlan {
    @Id
    private String id;

    private String tripSerialNo;
    private String travelLocation;
    private double latitude;
    private double longitude;
    private Date startDate;
    private Date endDate;

    private List<TripFlow> tripFlow; // Day-by-day activities

    public TripPlan() {
    }

    public TripPlan(String id, String tripSerialNo, String travelLocation, double latitude,
            double longitude, Date startDate, Date endDate, List<TripFlow> tripFlow) {
        this.id = id;
        this.tripSerialNo = tripSerialNo;
        this.travelLocation = travelLocation;
        this.latitude = latitude;
        this.longitude = longitude;
        this.startDate = startDate;
        this.endDate = endDate;
        this.tripFlow = tripFlow;
    }

    // Getters/Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public List<TripFlow> getTripFlow() {
        return tripFlow;
    }

    public void setTripFlow(List<TripFlow> tripFlow) {
        this.tripFlow = tripFlow;
    }
}
