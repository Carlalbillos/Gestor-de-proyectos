import type { UserRepository } from "../../domain/ports/UserRepository";
import type { User } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserProfile(id: string): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async getUserProjects(id: string): Promise<Project[]> {
    return await this.userRepository.getUserProjects(id);
  }
}
