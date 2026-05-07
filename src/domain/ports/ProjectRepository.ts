import type { Project, ProjectUser, ProjectDevelopment, ProjectRole } from "../entities/project.entity";
import type { CreateProjectDTO } from "../../application/dto/project.dto";

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
  getProjectRoles(): Promise<ProjectRole[]>;
  assignUser(projectId: string, userId: string, roleId: string): Promise<void>;
  updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void>;
  removeUser(projectId: string, userId: string): Promise<void>;
}
