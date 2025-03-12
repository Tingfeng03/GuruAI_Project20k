import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestsAndRooms {
  adults: number;
  children: number;
  rooms: number;
}

interface TripState {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsAndRooms: GuestsAndRooms;
  budget: string;
  activities: string;
  food: string;
  pace: string;
  additionalNotes: string;
}

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
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setTripData: (state, action: PayloadAction<Partial<TripState>>) => {
      return { ...state, ...action.payload };
    },
    resetTripData: () => initialState,
  },
});

export const { setTripData, resetTripData } = tripSlice.actions;
export default tripSlice.reducer;
