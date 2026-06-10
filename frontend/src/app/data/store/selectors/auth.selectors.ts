import type { RootState } from "../index";

export const selectCurrentUser = (s: RootState) => s.auth.user;
export const selectAuthToken = (s: RootState) => s.auth.token;
export const selectAuthLoading = (s: RootState) => s.auth.loading;
export const selectAuthError = (s: RootState) => s.auth.error;
export const selectIsLoggedIn = (s: RootState) => !!s.auth.token;
