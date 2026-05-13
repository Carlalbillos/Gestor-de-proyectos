import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { ProjectUser } from "../../../domain/entities/project.entity";

export class GetProjectUsersUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<ProjectUser[]> {
    return await this.projectRepository.getProjectUsers(id);
  }
}
