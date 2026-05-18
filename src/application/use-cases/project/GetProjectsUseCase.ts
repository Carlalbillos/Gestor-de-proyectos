import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../../domain/ports/ProjectRepository";
import type { Project } from "../../../domain/entities/project.entity";

export class GetProjectsUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    return await this.projectRepository.getProjects(params);
  }
}
