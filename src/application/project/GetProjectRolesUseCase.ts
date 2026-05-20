import type { ProjectTeamRepository } from "../../domain/ports/ProjectRepository";
import type { ProjectRole } from "../../domain/entities/project.entity";

export class GetProjectRolesUseCase {
  private projectRepository: ProjectTeamRepository;
  constructor(projectRepository: ProjectTeamRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(): Promise<ProjectRole[]> {
    return await this.projectRepository.getProjectRoles();
  }
}
