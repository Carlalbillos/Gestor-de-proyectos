import type { UserRepository, UserQueryParams, PaginatedResult, User } from "../../../domain/ports/UserRepository";

export class GetUsersUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(params?: UserQueryParams): Promise<PaginatedResult<User>> {
    return await this.userRepository.getUsers(params);
  }
}
