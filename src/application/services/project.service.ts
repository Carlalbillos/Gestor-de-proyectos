import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../domain/ports/ProjectRepository";
import type { Project } from "../../domain/entities/project.entity";

export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getProjectsList(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    return await this.projectRepository.getProjects(params);
  }
}
