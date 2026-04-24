import type { Project } from "../entities/project.entity";

export interface ProjectQueryParams {
  page?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ProjectRepository {
  getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>>;
}
