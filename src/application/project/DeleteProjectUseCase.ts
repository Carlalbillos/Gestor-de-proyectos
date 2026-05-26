import type { ProjectRepository } from "../../domain/ports/ProjectRepository";

export class DeleteProjectUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.projectRepository.deleteProject(id);
  }
}
