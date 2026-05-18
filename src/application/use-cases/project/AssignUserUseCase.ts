import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class AssignUserUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, userId: string, roleId: string): Promise<void> {
    return await this.projectRepository.assignUser(projectId, userId, roleId);
  }
}
