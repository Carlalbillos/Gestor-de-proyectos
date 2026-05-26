import type { ProjectTeamRepository } from "../../domain/ports/ProjectRepository";

export class AssignUserUseCase {
  private projectRepository: ProjectTeamRepository;
  constructor(projectRepository: ProjectTeamRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, userId: string, roleId: string): Promise<void> {
    return await this.projectRepository.assignUser(projectId, userId, roleId);
  }
}
