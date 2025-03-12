import { configureStore } from '@reduxjs/toolkit';
import tripReducer from '../features/tripSlice'; // Import tripSlice reducer

const store = configureStore({
  reducer: {
    trip: tripReducer, // Add tripReducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
