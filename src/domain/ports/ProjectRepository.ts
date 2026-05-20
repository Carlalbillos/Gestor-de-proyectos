import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry } from "../entities/project.entity";
import type { PaginatedResult } from "../shared/types/PaginatedResult";

// Re-export DTOs and shared types for backward compatibility
export type { PaginatedResult } from "../shared/types/PaginatedResult";
export type {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateDevelopmentDTO,
  UpdateDevelopmentDTO,
  UpdateTimeEntryDTO,
  ProjectQueryParams,
  ProjectTimeEntryQueryParams,
} from "../dtos/project.dto";

import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateDevelopmentDTO,
  UpdateDevelopmentDTO,
  UpdateTimeEntryDTO,
  ProjectQueryParams,
  ProjectTimeEntryQueryParams,
} from "../dtos/project.dto";

// 1. Basic CRUD operations
export interface ProjectRepository {
  getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>>;
  getProjectById(id: string): Promise<Project>;
  updateProject(id: string, project: UpdateProjectDTO): Promise<void>;
  createProject(project: CreateProjectDTO): Promise<void>;
  changeStatus(id: string): Promise<void>;
  deleteProject(id: string): Promise<void>;
}

// 2. Team and Member Management operations
export interface ProjectTeamRepository {
  getProjectUsers(id: string): Promise<ProjectUser[]>;
  getProjectRoles(): Promise<ProjectRole[]>;
  assignUser(projectId: string, userId: string, roleId: string): Promise<void>;
  updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void>;
  changeUserStatus(projectId: string, userId: string, isActive: boolean): Promise<void>;
}

// 3. Development Environments operations
export interface ProjectDevelopmentRepository {
  getProjectDevelopments(id: string): Promise<ProjectDevelopment[]>;
  createDevelopment(projectId: string, development: CreateDevelopmentDTO): Promise<void>;
  updateDevelopment(projectId: string, development: UpdateDevelopmentDTO): Promise<void>;
  deleteDevelopment(projectId: string, developmentId: string): Promise<void>;
}

// 4. Imputed Hours operations
export interface ProjectTimeEntryRepository {
  getProjectTimeEntries(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]>;
  updateProjectTimeEntry(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void>;
  deleteProjectTimeEntry(projectId: string, entryId: string): Promise<void>;
}
