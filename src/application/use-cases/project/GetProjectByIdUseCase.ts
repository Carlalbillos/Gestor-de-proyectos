import type { ProjectRepository, Project } from "../../../domain/ports/ProjectRepository";

export class GetProjectByIdUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<Project> {
    return await this.projectRepository.getProjectById(id);
  }
}
