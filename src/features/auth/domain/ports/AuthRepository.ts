import type { User } from "../entities/User";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
}
