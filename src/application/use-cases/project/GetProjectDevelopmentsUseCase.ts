import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { ProjectDevelopment } from "../../../domain/entities/project.entity";

export class GetProjectDevelopmentsUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<ProjectDevelopment[]> {
    return await this.projectRepository.getProjectDevelopments(id);
  }
}
