import type { UserRepository } from "../../../domain/ports/UserRepository";
import type { TimeEntriesResponse } from "../../../domain/entities/user.entity";

export class GetUserTimeEntriesUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<TimeEntriesResponse> {
    return await this.userRepository.getUserTimeEntries(id);
  }
}
