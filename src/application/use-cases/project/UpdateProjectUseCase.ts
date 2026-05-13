import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { UpdateProjectDTO } from "../../dto/project/UpdateProject.dto";

export class UpdateProjectUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id: string, project: UpdateProjectDTO): Promise<void> {
    return await this.projectRepository.updateProject(id, project);
  }
}
