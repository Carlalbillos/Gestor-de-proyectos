import type { AuthRepository, AuthResponse } from "@/domain/ports/AuthRepository";

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string): Promise<AuthResponse> {
    return this.authRepository.login({ email, password });
  }

  async logout(refreshToken: string): Promise<void> {
    return this.authRepository.logout(refreshToken);
  }
}
