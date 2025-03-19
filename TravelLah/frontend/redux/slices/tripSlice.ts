import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TripFlowActivity {
  activityId: number;
  specificLocation: string;
  address: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  activityType: string;
  notes: string;
}

export interface TripFlow {
  date: string;
  activityContent: TripFlowActivity[];
}

export interface ItineraryData {
  userId?: string;
  tripSerialNo?: string;
  travelLocation?: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  tripFlow?: TripFlow[];
}

export interface GuestsAndRooms {
  adults: number;
  children: number;
  rooms: number;
}

export interface TripState {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsAndRooms: GuestsAndRooms;
  budget: string;
  activities: string;
  food: string;
  pace: string;
  additionalNotes: string;
  itinerary: ItineraryData | null;
}

// This is your default initial state for trip data
const initialState: TripState = {
  destination: "",
  checkIn: "",
  checkOut: "",
  guestsAndRooms: { adults: 1, children: 0, rooms: 1 },
  budget: "",
  activities: "",
  food: "",
  pace: "",
  additionalNotes: "",
  itinerary: null,
};

export const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setTripData: (state, action: PayloadAction<Partial<TripState>>) => {
      return { ...state, ...action.payload };
    },

    clearTripData: () => {
      return initialState;
    },
  },
});

export const { setTripData, clearTripData } = tripSlice.actions;

export default tripSlice.reducer;
