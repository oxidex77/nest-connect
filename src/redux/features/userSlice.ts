import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of the data from our API
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface TenantProfile {
  id: string;
  subdomain: string;
  displayName: string;
}

// The complete state for an authenticated user
interface AuthState {
  user: UserProfile | null;
  tenant: TenantProfile | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  tenant: null,
  token: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action is dispatched on successful login/registration
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; tenant: TenantProfile; token: string }>) => {
      state.user = action.payload.user;
      state.tenant = action.payload.tenant;
      state.token = action.payload.token;
    },
    // This action is dispatched on logout
    logoutUser: (state) => {
      state.user = null;
      state.tenant = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logoutUser } = userSlice.actions;

export default userSlice.reducer;