import type { User, TimeEntriesResponse } from "../entities/user.entity";
import type { Project } from "../entities/project.entity";
import type { PaginatedResult } from "../shared/types/PaginatedResult";

// Re-export DTOs and shared types for backward compatibility
export type { PaginatedResult } from "../shared/types/PaginatedResult";
export type {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  AdminChangePasswordDTO,
  CreateTimeEntryDTO,
  UserQueryParams,
} from "../dtos/user.dto";

import type {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  AdminChangePasswordDTO,
  CreateTimeEntryDTO,
  UserQueryParams,
} from "../dtos/user.dto";

export interface UserRepository {
  getUsers(params?: UserQueryParams): Promise<PaginatedResult<User>>;
  getById(id: string): Promise<User>;
  createUser(dto: CreateUserDTO): Promise<void>;
  updateUser(id: string, dto: UpdateUserDTO): Promise<void>;
  changePassword(id: string, dto: ChangePasswordDTO): Promise<void>;
  adminChangePassword(id: string, dto: AdminChangePasswordDTO): Promise<void>;
  getUserProjects(id: string): Promise<Project[]>;
  getUserTimeEntries(id: string): Promise<TimeEntriesResponse>;
  createTimeEntry(id: string, dto: CreateTimeEntryDTO): Promise<void>;
  changeActivityUser(id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
