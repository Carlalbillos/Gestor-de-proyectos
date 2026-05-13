import type { LoginRequestDTO } from "@/application/dto/auth/LoginRequest.dto";
import type { LoginResponseDTO } from "@/application/dto/auth/LoginResponse.dto";

export type AuthResponse = LoginResponseDTO;


export interface AuthRepository {
  login(credentials: LoginRequestDTO): Promise<LoginResponseDTO>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }>;
}
