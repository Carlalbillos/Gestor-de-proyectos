// Re-export DTOs for backward compatibility
export type { LoginRequestDTO, LoginResponseDTO, AuthResponse } from "../dtos/auth.dto";

import type { LoginRequestDTO, LoginResponseDTO } from "../dtos/auth.dto";

export interface AuthRepository {
  login(credentials: LoginRequestDTO): Promise<LoginResponseDTO>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }>;
}
