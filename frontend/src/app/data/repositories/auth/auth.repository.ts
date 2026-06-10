import type {
  AuthResponse,
  IAuthDatasource,
  LoginPayload,
  RegisterPayload,
  User,
} from "../../models";
import type { IAuthRepository } from "../../models/auth.repository.interface";

export class AuthRepository implements IAuthRepository {
  constructor(private datasource: IAuthDatasource) {}

  login(payload: LoginPayload): Promise<AuthResponse> {
    return this.datasource.login(payload);
  }

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return this.datasource.register(payload);
  }

  logout(): Promise<void> {
    return this.datasource.logout();
  }

  me(): Promise<User> {
    return this.datasource.me();
  }
}
