import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class DeleteDevelopmentUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, developmentId: string): Promise<void> {
    return await this.projectRepository.deleteDevelopment(projectId, developmentId);
  }
}
