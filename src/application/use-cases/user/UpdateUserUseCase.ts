import type { UserRepository } from "../../../domain/ports/UserRepository";
import type { UpdateUserDTO } from "../../dto/user/UpdateUser.dto";

export class UpdateUserUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, dto: UpdateUserDTO): Promise<void> {
    return await this.userRepository.updateUser(id, dto);
  }
}
