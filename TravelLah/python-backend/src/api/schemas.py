from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class StreamOptions(BaseModel):
    """Input schema for itinerary generation request"""
    task: str
    max_revisions: int
    revision_number: int
    itinerary_params: Dict[str, Any]

class ActivityContent(BaseModel):
    """Schema for an activity in the itinerary"""
    specific_location: str
    address: str
    latitude: str
    longitude: str
    start_time: str
    end_time: str
    activity_type: str
    notes: str

class TripDay(BaseModel):
    """Schema for a day in the trip"""
    date: str
    activity_content: List[ActivityContent]

class Itinerary(BaseModel):
    """Schema for the complete itinerary"""
    userId: str
    tripSerialNo: str
    TravelLocation: str
    latitude: str
    longitude: str
    tripFlow: List[TripDay]

class ItineraryResponse(BaseModel):
    """Response schema for the API"""
    itinerary: Itinerary
