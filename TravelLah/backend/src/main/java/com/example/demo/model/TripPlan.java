package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

// import java.util.Date;
import java.util.List;

@Document(collection = "UserItinerary")
public class TripPlan {
    @Id
    private String id;
    
    @Field("tripSerialNo")
    private String tripSerialNo;

    @Field("TravelLocation")
    private String travelLocation;
    private String latitude;
    private String longitude;

    @Field("start-date")
    private String startDate;

    @Field("end-date")
    private String endDate;

    @Field("tripFlow")
    private List<TripFlow> tripFlow;

    public TripPlan() {
    }

    public TripPlan(String id, String tripSerialNo, String travelLocation, String latitude,
            String longitude, String startDate, String endDate, List<TripFlow> tripFlow) {
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public List<TripFlow> getTripFlow() {
        return tripFlow;
    }

    public void setTripFlow(List<TripFlow> tripFlow) {
        this.tripFlow = tripFlow;
    }
}
