import type { ProjectRepository, ProjectQueryParams, PaginatedResult, Project } from "../../../domain/ports/ProjectRepository";

export class GetProjectsUseCase {
  private projectRepository: ProjectRepository;
  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    return await this.projectRepository.getProjects(params);
  }
}
