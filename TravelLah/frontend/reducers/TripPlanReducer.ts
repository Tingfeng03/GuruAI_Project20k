// reducers/someReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SomeState = string;

const initialState: SomeState = 'initial value';

const someSlice = createSlice({
  name: 'someState',
  initialState,
  reducers: {
    updateValue: (state, action: PayloadAction<string>) => action.payload,
  },
});

export const { updateValue } = someSlice.actions;
export default someSlice.reducer;
