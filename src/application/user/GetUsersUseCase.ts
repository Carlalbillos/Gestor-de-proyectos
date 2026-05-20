import type { UserRepository, UserQueryParams, PaginatedResult } from "../../domain/ports/UserRepository";
import type { User } from "../../domain/entities/user.entity";

export class GetUsersUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(params?: UserQueryParams): Promise<PaginatedResult<User>> {
    return await this.userRepository.getUsers(params);
  }
}
