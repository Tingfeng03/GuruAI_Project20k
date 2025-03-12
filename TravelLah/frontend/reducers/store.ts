// store.ts
import { configureStore  } from '@reduxjs/toolkit';
import rootReducer from './reducers';

// Infer the `AppState` type from the rootReducer
export type AppState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
