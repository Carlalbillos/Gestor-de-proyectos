import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { CreateDevelopmentDTO } from "../../dto/project/CreateDevelopment.dto";

export class CreateDevelopmentUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, development: CreateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.createDevelopment(projectId, development);
  }
}
