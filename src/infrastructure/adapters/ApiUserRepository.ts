import { api } from "./AxiosHttpClient";
import type { UserRepository } from "../../domain/ports/UserRepository";
import type { User, CreateUserDTO, UpdateUserDTO, TimeEntriesResponse } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";

export class ApiUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("users");
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`users/${id}`);
    return response.data;
  }

  async createUser(dto: CreateUserDTO): Promise<void> {
    await api.post("users", dto);
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<void> {
    await api.put(`users/${id}`, dto);
  }

  async getUserProjects(id: string): Promise<Project[]> {
    const response = await api.get<Project[]>(`users/${id}/projects`);
    return response.data;
  }

  async getUserTimeEntries(id: string): Promise<TimeEntriesResponse> {
    const response = await api.get<TimeEntriesResponse>(`users/${id}/time-entries`);
    return response.data;
  }
}
