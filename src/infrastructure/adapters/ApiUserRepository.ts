import { api } from "./AxiosHttpClient";
import type { UserRepository, UserQueryParams, PaginatedResult } from "../../domain/ports/UserRepository";
import type { User, TimeEntriesResponse } from "../../domain/entities/user.entity";
import type { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AdminChangePasswordDTO, CreateTimeEntryDTO } from "../../application/dto/user.dto";
import type { Project } from "../../domain/entities/project.entity";
import { UserMapper } from "../mappers/UserMapper";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ApiUserRepository implements UserRepository {
  async getUsers(params?: UserQueryParams): Promise<PaginatedResult<User>> {
    const queryParams: any = {};
    if (params) {
      if (typeof params.isActive === "boolean") queryParams.is_active = params.isActive ? "true" : "false";
      if (params.role) queryParams.role = params.role;
      if (params.search) queryParams.search = params.search;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
    }

    const response = await api.get<any>("users", { params: queryParams });

    const rawItems = Array.isArray(response.data) ? response.data : (response.data.items || response.data.data || []);
    const total = response.data.total || rawItems.length;

    const data = rawItems.map(UserMapper.toDomain);
    return { data, total };
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

  async createTimeEntry(id: string, dto: CreateTimeEntryDTO): Promise<void> {
    await api.post(`users/${id}/time-entries`, dto);
  }

  async changeActivityUser(id: string): Promise<void> {
    await api.patch(`users/${id}/change-status`);
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`users/${id}`);
  }
}
