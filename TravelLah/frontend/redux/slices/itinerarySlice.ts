// redux/slices/itinerarySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Trip {
  id?: string;
  userId?: string;
  tripSerialNo?: string;
  travelLocation?: string; // <-- lowercase if your backend returns "travelLocation"
  latitude?: number | string;
  longitude?: number | string;
  startDate?: string;
  endDate?: string;
  tripFlow?: any[];
}

interface ItineraryState {
  itineraries: Trip[];
}

const initialState: ItineraryState = {
  itineraries: [],
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    // Overwrites the entire list
    setItineraries: (state, action: PayloadAction<Trip[]>) => {
      state.itineraries = action.payload;
    },
    // Appends a single new trip
    addItinerary: (state, action: PayloadAction<Trip>) => {
      state.itineraries.push(action.payload);
    },
  },
});

export const { setItineraries, addItinerary } = itinerarySlice.actions;
export default itinerarySlice.reducer;
