import type { User, TimeEntriesResponse } from "../entities/user.entity";
import type { CreateUserDTO } from "../../application/dto/user/CreateUser.dto";
import type { UpdateUserDTO } from "../../application/dto/user/UpdateUser.dto";
import type { ChangePasswordDTO } from "../../application/dto/user/ChangePassword.dto";
import type { AdminChangePasswordDTO } from "../../application/dto/user/AdminChangePassword.dto";
import type { CreateTimeEntryDTO } from "../../application/dto/user/CreateTimeEntry.dto";
import type { Project } from "../entities/project.entity";

export interface UserQueryParams {
  isActive?: boolean;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

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