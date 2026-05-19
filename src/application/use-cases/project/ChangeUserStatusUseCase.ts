import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class ChangeUserStatusUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, userId: string, isActive: boolean): Promise<void> {
    return await this.projectRepository.changeUserStatus(projectId, userId, isActive);
  }
}
