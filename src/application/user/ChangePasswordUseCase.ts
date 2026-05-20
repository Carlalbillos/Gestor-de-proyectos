import type { UserRepository } from "../../domain/ports/UserRepository";
import type { ChangePasswordDTO } from "../../domain/ports/UserRepository";

export class ChangePasswordUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, dto: ChangePasswordDTO): Promise<void> {
    return await this.userRepository.changePassword(id, dto);
  }
}
