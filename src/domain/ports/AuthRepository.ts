import type { User } from "@/domain/entities/user.entity";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
}
