import type { AuthRepository } from "@/domain/ports/AuthRepository";

export class RefreshTokenUseCase {
  private authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authRepository.refreshToken(refreshToken);
  }
}
