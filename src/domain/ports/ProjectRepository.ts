import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry } from "../entities/project.entity";
import type { CreateProjectDTO } from "../../application/dto/project.dto";
import type { UpdateTimeEntryDTO } from "../../application/dto/user.dto";

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  clientId?: string;
  appUserId?: string;
  isActive?: boolean;
  search?: string;
}

export interface ProjectTimeEntryQueryParams {
  from?: string;
  to?: string;
  app_user_id?: string;
  min_hour?: number;
  max_hour?: number;
  has_comment?: boolean;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ProjectRepository {
  getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>>;
  getProjectById(id: string): Promise<Project>;
  getProjectUsers(id: string): Promise<ProjectUser[]>;
  getProjectDevelopments(id: string): Promise<ProjectDevelopment[]>;
  getProjectRoles(): Promise<ProjectRole[]>;
  getProjectTimeEntries(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]>;
  assignUser(projectId: string, userId: string, roleId: string): Promise<void>;
  updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void>;
  removeUser(projectId: string, userId: string): Promise<void>;

  createProject(project: CreateProjectDTO): Promise<void>;
  updateProjectTimeEntry(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void>;
  deleteProjectTimeEntry(projectId: string, entryId: string): Promise<void>;
  changeStatus(id: string): Promise<void>;
}
