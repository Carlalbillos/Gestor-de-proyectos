import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { ProjectRole } from "../../../domain/entities/project.entity";

export class GetProjectRolesUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(): Promise<ProjectRole[]> {
    return await this.projectRepository.getProjectRoles();
  }
}
