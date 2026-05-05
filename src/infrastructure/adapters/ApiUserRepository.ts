import { api } from "./AxiosHttpClient";
import type { UserRepository } from "../../domain/ports/UserRepository";
import type { User, CreateUserDTO, UpdateUserDTO, TimeEntriesResponse, ChangePasswordDTO, AdminChangePasswordDTO } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";
import { UserMapper } from "../mappers/UserMapper";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ApiUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    const response = await api.get<any[]>("users");
    return (Array.isArray(response.data) ? response.data : []).map(UserMapper.toDomain);
  }

  async getById(id: string): Promise<User> {
    const response = await api.get<any>(`users/${id}`);
    return UserMapper.toDomain(response.data);
  }

  async createUser(dto: CreateUserDTO): Promise<void> {
    await api.post("users", {
      ...dto,
      role: UserMapper.toApiRole(dto.role),
    });
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<void> {
    await api.put(`users/${id}`, {
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      role: dto.role ? UserMapper.toApiRole(dto.role) : undefined,
      is_active: dto.isActive,
    });
  }

  async changePassword(id: string, dto: ChangePasswordDTO): Promise<void> {
    await api.patch(`users/${id}/password-change`, {
      current_password: dto.currentPassword,
      new_password: dto.newPassword,
    });
  }

  async adminChangePassword(id: string, dto: AdminChangePasswordDTO): Promise<void> {
    await api.patch(`users/${id}/admin-password`, {
      new_password: dto.newPassword,
    });
  }

  async getUserProjects(id: string): Promise<Project[]> {
    const response = await api.get<any[]>(`users/${id}/projects`);
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toDomain);
  }

  async getUserTimeEntries(id: string): Promise<TimeEntriesResponse> {
    const response = await api.get<any>(`users/${id}/time-entries`);
    return {
      totalHours: response.data.total_hours,
      data: (response.data.data || []).map(UserMapper.toTimeEntryDomain),
    };
  }
}
