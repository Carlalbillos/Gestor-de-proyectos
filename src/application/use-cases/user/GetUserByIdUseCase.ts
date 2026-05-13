import type { UserRepository, User } from "../../../domain/ports/UserRepository";

export class GetUserByIdUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.getById(id);
  }
}
