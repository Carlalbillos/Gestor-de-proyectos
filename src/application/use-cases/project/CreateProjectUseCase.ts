import type { ProjectRepository } from "../../../domain/ports/ProjectRepository";
import type { CreateProjectDTO } from "../../dto/project/CreateProject.dto";

export class CreateProjectUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(project: CreateProjectDTO): Promise<void> {
    return await this.projectRepository.createProject(project);
  }
}
