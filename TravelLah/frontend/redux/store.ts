import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import itineraryReducer from "./slices/itinerarySlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    itinerary: itineraryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
