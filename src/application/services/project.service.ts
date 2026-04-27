import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../domain/ports/ProjectRepository";
import type { Project, ProjectUser, ProjectDevelopment, CreateProjectDTO } from "../../domain/entities/project.entity";

export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getProjectsList(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    return await this.projectRepository.getProjects(params);
  }

  async getProjectById(id: string): Promise<Project> {
    return await this.projectRepository.getProjectById(id);
  }

  async createProject(project: CreateProjectDTO): Promise<void> {
    return await this.projectRepository.createProject(project);
  }

  async getProjectUsers(id: string): Promise<ProjectUser[]> {
    return await this.projectRepository.getProjectUsers(id);
  }

  async getProjectDevelopments(id: string): Promise<ProjectDevelopment[]> {
    return await this.projectRepository.getProjectDevelopments(id);
  }
}
