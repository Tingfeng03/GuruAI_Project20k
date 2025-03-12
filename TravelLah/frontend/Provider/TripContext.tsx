import React, { createContext, useState, ReactNode } from 'react';

export interface TripData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsAndRooms: {
    adults: number;
    children: number;
    rooms: number;
  };
  budget: string;
  activities: string;
  food: string;
  pace: string;
  additionalNotes: string;
}

export interface TripContextType {
  tripData: TripData;
  setTripData: (data: Partial<TripData>) => void;
}

export const TripContext = createContext<TripContextType>({
  tripData: {
    destination: '',
    checkIn: '',
    checkOut: '',
    guestsAndRooms: {
      adults: 1,
      children: 0,
      rooms: 1,
    },
    budget: '',
    activities: '',
    food: '',
    pace: '',
    additionalNotes: '',
  },
  setTripData: () => {},
});

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripDataState] = useState<TripData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guestsAndRooms: {
      adults: 1,
      children: 0,
      rooms: 1,
    },
    budget: '',
    activities: '',
    food: '',
    pace: '',
    additionalNotes: '',
  });

  const setTripData = (data: Partial<TripData>) => {
    setTripDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  );
}
