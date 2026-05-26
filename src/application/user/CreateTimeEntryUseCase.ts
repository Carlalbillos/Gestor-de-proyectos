import type { UserRepository } from "../../domain/ports/UserRepository";
import type { CreateTimeEntryDTO } from "../../domain/ports/UserRepository";

export class CreateTimeEntryUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, dto: CreateTimeEntryDTO): Promise<void> {
    return await this.userRepository.createTimeEntry(id, dto);
  }
}
