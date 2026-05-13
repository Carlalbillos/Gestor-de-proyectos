import type { User } from "@/domain/entities/user.entity";

export interface LoginResponseDTO {
  user: User;
  accessToken: string;
  refreshToken: string;
}
