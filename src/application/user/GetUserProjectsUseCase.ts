import type { UserRepository } from "../../domain/ports/UserRepository";
import type { Project } from "../../domain/entities/project.entity";

export class GetUserProjectsUseCase {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<Project[]> {
    return await this.userRepository.getUserProjects(id);
  }
}
