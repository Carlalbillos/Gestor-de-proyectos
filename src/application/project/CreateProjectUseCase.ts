import type { ProjectRepository } from "../../domain/ports/ProjectRepository";
import type { CreateProjectDTO } from "../../domain/ports/ProjectRepository";

export class CreateProjectUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(project: CreateProjectDTO): Promise<void> {
    return await this.projectRepository.createProject(project);
  }
}
