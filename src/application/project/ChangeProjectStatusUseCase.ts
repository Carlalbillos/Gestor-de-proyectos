import type { ProjectRepository } from "../../domain/ports/ProjectRepository";

export class ChangeProjectStatusUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.projectRepository.changeStatus(id);
  }
}
