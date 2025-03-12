import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TripState {
  tripPlan: Record<string, any>; // Using a flexible object type
}

const initialState: TripState = {
  tripPlan: {},
};

const tripSlice = createSlice({
  name: 'tripPlan',
  initialState,
  reducers: {
    setTripPlan: (state, action: PayloadAction<Record<string, any>>) => {
      state.tripPlan = action.payload;
    },

    updateTripDetail: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.tripPlan[action.payload.key] = action.payload.value;
    },

    resetTripPlan: (state) => {
      state.tripPlan = {};
    },
  },
});

export const { setTripPlan, updateTripDetail, resetTripPlan } = tripSlice.actions;

export default tripSlice.reducer;
