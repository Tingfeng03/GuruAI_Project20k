import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Trip {
    id: string;
    itinerary: {
        tripSerialNo: string;
        travelLocation: string;
        latitude: number;
        longitude: number;
        tripFlow: { date: string; activityContent: any[] }[];
    };
}

interface ItineraryState {
    itineraries: Trip[];
    loading: boolean;
    error: string | null;
}

const initialState: ItineraryState = {
    itineraries: [],
    loading: false,
    error: null,
};

// ✅ Fix: Add `fetchItineraries` async thunk
export const fetchItineraries = createAsyncThunk("itinerary/fetchItineraries", async () => {
    const response = await fetch("http://localhost:8080/api/itineraries");
    if (!response.ok) throw new Error("Failed to fetch itineraries");
    return response.json();
});

const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setItineraries: (state, action: PayloadAction<Trip[]>) => {
            state.itineraries = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItineraries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItineraries.fulfilled, (state, action) => {
                state.loading = false;
                state.itineraries = action.payload;
            })
            .addCase(fetchItineraries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load itineraries";
            });
    },
});

export const { setItineraries } = itinerarySlice.actions;
export default itinerarySlice.reducer;
