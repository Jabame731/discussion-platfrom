import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "./wellness-platform.model";

export interface IAuthDatasource {
  login(payload: LoginPayload): Promise<AuthResponse>;
  register(payload: RegisterPayload): Promise<AuthResponse>;
  logout(): Promise<void>;
  me(): Promise<User>;
}
