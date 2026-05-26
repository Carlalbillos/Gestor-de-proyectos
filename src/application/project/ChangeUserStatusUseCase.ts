import type { ProjectTeamRepository } from "../../domain/ports/ProjectRepository";

export class ChangeUserStatusUseCase {
  private projectRepository: ProjectTeamRepository;
  constructor(projectRepository: ProjectTeamRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, userId: string, isActive: boolean): Promise<void> {
    return await this.projectRepository.changeUserStatus(projectId, userId, isActive);
  }
}
