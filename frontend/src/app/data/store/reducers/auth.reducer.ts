import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../models";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("auth_token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem("auth_token", action.payload.token);
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth_token");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
