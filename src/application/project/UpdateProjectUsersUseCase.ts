import type { ProjectTeamRepository } from "../../domain/ports/ProjectRepository";

export class UpdateProjectUsersUseCase {
  private projectRepository: ProjectTeamRepository;
  constructor(projectRepository: ProjectTeamRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void> {
    return await this.projectRepository.updateProjectUsers(projectId, users);
  }
}
