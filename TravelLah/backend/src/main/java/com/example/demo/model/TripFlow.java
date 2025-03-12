package com.example.demo.model;

import java.util.List;

public class TripFlow {
    private String date;
    private List<ActivityContent> activityContent;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<ActivityContent> getActivityContent() {
        return activityContent;
    }

    public void setActivityContent(List<ActivityContent> activityContent) {
        this.activityContent = activityContent;
    }
}
