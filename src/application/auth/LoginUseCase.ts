import type { AuthRepository } from "@/domain/ports/AuthRepository";
import type { LoginResponseDTO } from "@/domain/ports/AuthRepository";

export class LoginUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string): Promise<LoginResponseDTO> {
    return this.authRepository.login({ email, password });
  }
}
