import type { UserRepository } from "../../../domain/ports/UserRepository";
import type { AdminChangePasswordDTO } from "../../dto/user/AdminChangePassword.dto";

export class AdminChangePasswordUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, dto: AdminChangePasswordDTO): Promise<void> {
    return await this.userRepository.adminChangePassword(id, dto);
  }
}
