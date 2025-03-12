package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "tripPlans")
public class TripPlan { 
    @Id
    private String id;
    private String tripSerialNo;
    private TravelLocation travelLocation;
    private Duration duration;
    private String locationName;

    public TripPlan(String id, String tripSerialNo, TravelLocation travelLocation, Duration duration, String locationName) {
        this.id = id;
        this.tripSerialNo = tripSerialNo;
        this.travelLocation = travelLocation;
        this.duration = duration;
        this.locationName = locationName;
    }

    // Getters and setters
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

    public TravelLocation getTravelLocation() {
        return travelLocation;
    }

    public void setTravelLocation(TravelLocation travelLocation) {
        this.travelLocation = travelLocation;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public class TravelLocation {
        private double lat;
        private double lon;

        // Getters and setters

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLon() {
            return lon;
        }

        public void setLon(double lon) {
            this.lon = lon;
        }
    }

    public static class Duration {
        private Date startDate;
        private Date endDate;

        // Getters and setters

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
    }
}
