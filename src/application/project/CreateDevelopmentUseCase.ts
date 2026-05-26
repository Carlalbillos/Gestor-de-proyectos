import type { ProjectDevelopmentRepository } from "../../domain/ports/ProjectRepository";
import type { CreateDevelopmentDTO } from "../../domain/ports/ProjectRepository";

export class CreateDevelopmentUseCase {
  private projectRepository: ProjectDevelopmentRepository;
  constructor(projectRepository: ProjectDevelopmentRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, development: CreateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.createDevelopment(projectId, development);
  }
}
