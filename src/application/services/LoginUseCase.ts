import type { AuthRepository, AuthResponse } from "@/domain/ports/AuthRepository";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    return this.authRepository.login({ email, password });
  }
}
