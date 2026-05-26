import type { UserRepository } from "../../domain/ports/UserRepository";
import type { CreateUserDTO } from "../../domain/ports/UserRepository";

export class CreateUserUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto: CreateUserDTO): Promise<void> {
    return await this.userRepository.createUser(dto);
  }
}
