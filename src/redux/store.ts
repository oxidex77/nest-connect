import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Make sure the path to your slice is correct

export const store = configureStore({
  reducer: {
    // This is where you combine all your reducers (slices)
    user: userReducer,
  },
});

// This is the most important part for fixing your App.tsx error.
// It infers the `RootState` type directly from the store itself.
export type RootState = ReturnType<typeof store.getState>;

// This type is useful for dispatching actions
export type AppDispatch = typeof store.dispatch;