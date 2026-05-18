import type { UserRepository } from "../../../domain/ports/UserRepository";

export class DeleteUserUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }
}
