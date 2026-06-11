import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkApi } from "../index";
import { authActions } from "../reducers/auth.reducer";
import type { LoginPayload, RegisterPayload, User } from "../../models";

export const loginUser = createAsyncThunk<
  User | undefined,
  LoginPayload,
  ThunkApi
>("auth/login", async (payload, { dispatch, extra }) => {
  dispatch(authActions.authStart());
  try {
    const result = await extra.authRepository.login(payload);
    dispatch(
      authActions.authSuccess({ user: result.user, token: result.token }),
    );
    return result.user;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    console.log("message", message);
    dispatch(authActions.authFailure(message));
  }
});

export const registerUser = createAsyncThunk<
  User | undefined,
  RegisterPayload,
  ThunkApi
>("auth/register", async (payload, { dispatch, extra }) => {
  dispatch(authActions.authStart());
  try {
    const result = await extra.authRepository.register(payload);
    dispatch(
      authActions.authSuccess({ user: result.user, token: result.token }),
    );
    return result.user;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    console.log("message", message);

    dispatch(authActions.authFailure(message));
  }
});

export const logoutUser = createAsyncThunk<void, void, ThunkApi>(
  "auth/logout",
  async (_, { dispatch, extra }) => {
    try {
      await extra.authRepository.logout();
    } finally {
      dispatch(authActions.logoutSuccess());
    }
  },
);

export const fetchCurrentUser = createAsyncThunk<
  User | undefined,
  void,
  ThunkApi
>("auth/me", async (_, { dispatch, extra }) => {
  dispatch(authActions.authStart());
  try {
    const user = await extra.authRepository.me();
    dispatch(authActions.setUser(user));
    return user;
  } catch {
    dispatch(authActions.logoutSuccess());
  }
});
