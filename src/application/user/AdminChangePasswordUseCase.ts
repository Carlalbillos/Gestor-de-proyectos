import type { UserRepository } from "../../domain/ports/UserRepository";
import type { AdminChangePasswordDTO } from "../../domain/ports/UserRepository";

export class AdminChangePasswordUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, dto: AdminChangePasswordDTO): Promise<void> {
    return await this.userRepository.adminChangePassword(id, dto);
  }
}
