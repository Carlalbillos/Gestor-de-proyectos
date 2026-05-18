import type { UserRepository } from "../../../domain/ports/UserRepository";
import type { User } from "../../../domain/entities/user.entity";

export class GetUserByIdUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.getById(id);
  }
}
