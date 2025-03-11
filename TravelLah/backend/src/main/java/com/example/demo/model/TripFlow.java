package com.example.demo.model;

import java.util.List;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tripflows")
public class TripFlow {
    @Id
    private String id;
    private Date datetime;
    private List<ActivityContent> activity;

    public TripFlow() {
    }

    public TripFlow(String id, Date datetime, List<ActivityContent> activity) {
        this.id = id;
        this.datetime = datetime;
        this.activity = activity;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getDatetime() {
        return datetime;
    }

    public void setDatetime(Date datetime) {
        this.datetime = datetime;
    }

    public List<ActivityContent> getActivity() {
        return activity;
    }

    public void setActivity(List<ActivityContent> activity) {
        this.activity = activity;
    }

    public static class ActivityContent {
        private Trip trip;

        // Getters and setters

        public Trip getTrip() {
            return trip;
        }

        public void setTrip(Trip trip) {
            this.trip = trip;
        }

        public static class Trip {
            private String specificNameOfLocation;
            private String address;
            private Location goingWhere;
            private Duration duration;
            private String whatToDo;

            // Getters and setters

            public String getSpecificNameOfLocation() {
                return specificNameOfLocation;
            }

            public void setSpecificNameOfLocation(String specificNameOfLocation) {
                this.specificNameOfLocation = specificNameOfLocation;
            }

            public String getAddress() {
                return address;
            }

            public void setAddress(String address) {
                this.address = address;
            }

            public Location getGoingWhere() {
                return goingWhere;
            }

            public void setGoingWhere(Location goingWhere) {
                this.goingWhere = goingWhere;
            }

            public Duration getDuration() {
                return duration;
            }

            public void setDuration(Duration duration) {
                this.duration = duration;
            }

            public String getWhatToDo() {
                return whatToDo;
            }

            public void setWhatToDo(String whatToDo) {
                this.whatToDo = whatToDo;
            }
        }
    }

    public class Location {
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

    public class Duration {
        private String startTime;
        private String endTime;

        // Getters and setters

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
    }
}
