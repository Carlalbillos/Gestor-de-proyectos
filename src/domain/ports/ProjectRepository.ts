import type { Project, ProjectUser, ProjectDevelopment, CreateProjectDTO } from "../entities/project.entity";

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  clientId?: string;
  appUserId?: string;
  isActive?: boolean;
  search?: string;
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
