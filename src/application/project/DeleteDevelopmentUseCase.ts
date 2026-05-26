import type { ProjectDevelopmentRepository } from "../../domain/ports/ProjectRepository";

export class DeleteDevelopmentUseCase {
  private projectRepository: ProjectDevelopmentRepository;
  constructor(projectRepository: ProjectDevelopmentRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, developmentId: string): Promise<void> {
    return await this.projectRepository.deleteDevelopment(projectId, developmentId);
  }
}
