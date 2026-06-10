import { toDomainError } from "../../errors/domain-error";
import {
  api,
  type AuthResponse,
  type IAuthDatasource,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "../../models";

export class AuthDatasource implements IAuthDatasource {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async me(): Promise<User> {
    try {
      const { data } = await api.get<User>("/auth/me");
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }
}
