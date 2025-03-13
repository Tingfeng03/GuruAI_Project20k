package com.example.demo.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Field;

public class TripFlow {
    private String date;

    @Field("activityContent")
    private List<ActivityContent> activityContent;

    public TripFlow() {
    }

    public TripFlow(String date, List<ActivityContent> activityContent) {
        this.date = date;
        this.activityContent = activityContent;
    }

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
