import type { LoginPayload, RegisterPayload } from "../data/models";
import {
  loginUser,
  logoutUser,
  registerUser,
  type AppDispatch,
} from "../data/store";

export class AuthUsecase {
  constructor(private dispatch: AppDispatch) {}

  login(payload: LoginPayload): void {
    this.dispatch(loginUser(payload));
  }

  logout(): void {
    this.dispatch(logoutUser());
  }

  register(payload: RegisterPayload): void {
    this.dispatch(registerUser(payload));
  }
}
