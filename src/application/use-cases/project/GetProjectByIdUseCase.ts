import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { Project } from "../../../domain/entities/project.entity";

export class GetProjectByIdUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<Project> {
    return await this.projectRepository.getProjectById(id);
  }
}
