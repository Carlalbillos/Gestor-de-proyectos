import type { Project, ProjectUser, ProjectDevelopment, CreateProjectDTO } from "../entities/project.entity";

export interface ProjectQueryParams {
  page?: number;
  search?: string;
  allProjects?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ProjectRepository {
  getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>>;
  getProjectById(id: string): Promise<Project>;
  createProject(project: CreateProjectDTO): Promise<void>;
  getProjectUsers(id: string): Promise<ProjectUser[]>;
  getProjectDevelopments(id: string): Promise<ProjectDevelopment[]>;
}
