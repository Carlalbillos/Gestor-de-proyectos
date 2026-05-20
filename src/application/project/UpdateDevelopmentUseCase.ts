import type { ProjectDevelopmentRepository } from "../../domain/ports/ProjectRepository";
import type { UpdateDevelopmentDTO } from "../../domain/ports/ProjectRepository";

export class UpdateDevelopmentUseCase {
  private projectRepository: ProjectDevelopmentRepository;
  constructor(projectRepository: ProjectDevelopmentRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, development: UpdateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.updateDevelopment(projectId, development);
  }
}
