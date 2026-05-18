import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class UpdateProjectUsersUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void> {
    return await this.projectRepository.updateProjectUsers(projectId, users);
  }
}
