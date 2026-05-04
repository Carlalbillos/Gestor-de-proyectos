import type { User, CreateUserDTO, UpdateUserDTO, TimeEntriesResponse, ChangePasswordDTO, AdminChangePasswordDTO } from "../entities/user.entity";
import type { Project } from "../entities/project.entity";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  getById(id: string): Promise<User>;
  createUser(dto: CreateUserDTO): Promise<void>;
  updateUser(id: string, dto: UpdateUserDTO): Promise<void>;
  changePassword(id: string, dto: ChangePasswordDTO): Promise<void>;
  adminChangePassword(id: string, dto: AdminChangePasswordDTO): Promise<void>;
  getUserProjects(id: string): Promise<Project[]>;
  getUserTimeEntries(id: string): Promise<TimeEntriesResponse>;
}