import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WeatherState {
  weather: any | null;
}

const initialState: WeatherState = {
  weather: null,
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeather: (state, action: PayloadAction<any>) => {
      state.weather = action.payload;
    },
  },
});

export const { setWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
