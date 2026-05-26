import type { ProjectTeamRepository } from "../../domain/ports/ProjectRepository";
import type { ProjectUser } from "../../domain/entities/project.entity";

export class GetProjectUsersUseCase {
  private projectRepository: ProjectTeamRepository;
  constructor(projectRepository: ProjectTeamRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<ProjectUser[]> {
    return await this.projectRepository.getProjectUsers(id);
  }
}
