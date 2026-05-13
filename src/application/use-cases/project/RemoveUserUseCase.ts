import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";

export class RemoveUserUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, userId: string): Promise<void> {
    return await this.projectRepository.removeUser(projectId, userId);
  }
}
