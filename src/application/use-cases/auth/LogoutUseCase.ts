import type { AuthRepository } from "../../../domain/ports/AuthRepository";

export class LogoutUseCase {
  private authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<void> {
    return await this.authRepository.logout(refreshToken);
  }
}
