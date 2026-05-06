import type { User, TimeEntriesResponse } from "../entities/user.entity";
import type { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AdminChangePasswordDTO } from "../../application/dto/user.dto";
import type { Project } from "../entities/project.entity";

export interface UserQueryParams {
  isActive?: boolean;
  role?: string;
  page?: number;
  limit?: number;
}

export interface UserRepository {
  getUsers(params?: UserQueryParams): Promise<User[]>;
  getById(id: string): Promise<User>;
  createUser(dto: CreateUserDTO): Promise<void>;
  updateUser(id: string, dto: UpdateUserDTO): Promise<void>;
  changePassword(id: string, dto: ChangePasswordDTO): Promise<void>;
  adminChangePassword(id: string, dto: AdminChangePasswordDTO): Promise<void>;
  getUserProjects(id: string): Promise<Project[]>;
  getUserTimeEntries(id: string): Promise<TimeEntriesResponse>;
}