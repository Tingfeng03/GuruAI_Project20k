package com.example.demo.model;

public class ActivityContent {

    private String specificLocation;
    private String address;
    private String latitude;
    private String longitude;
    private String startTime;
    private String endTime;
    private String activityType;
    private String notes;

    public ActivityContent() {
    }

    public ActivityContent(String specificLocation, String address, String latitude, String longitude,
            String startTime, String endTime, String activityType, String notes) {
        this.specificLocation = specificLocation;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.startTime = startTime;
        this.endTime = endTime;
        this.activityType = activityType;
        this.notes = notes;
    }

    public String getSpecificLocation() {
        return specificLocation;
    }

    public void setSpecificLocation(String specificLocation) {
        this.specificLocation = specificLocation;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
