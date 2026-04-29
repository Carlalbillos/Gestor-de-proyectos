import type { Project, ProjectUser, ProjectDevelopment, CreateProjectDTO } from "../entities/project.entity";

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  client_id?: string;
  app_user_id?: string;
  is_active?: boolean;
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
