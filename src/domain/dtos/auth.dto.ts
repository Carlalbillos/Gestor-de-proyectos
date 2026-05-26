export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: import("../entities/user.entity").User;
  accessToken: string;
  refreshToken: string;
}

export type AuthResponse = LoginResponseDTO;
