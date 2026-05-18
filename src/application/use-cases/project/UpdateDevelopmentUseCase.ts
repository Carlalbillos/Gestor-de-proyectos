import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { UpdateDevelopmentDTO } from "../../dto/project/UpdateDevelopment.dto";

export class UpdateDevelopmentUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectId: string, development: UpdateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.updateDevelopment(projectId, development);
  }
}
