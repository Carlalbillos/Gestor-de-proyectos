import { api } from "./AxiosHttpClient";
import type { UserRepository } from "../../domain/ports/UserRepository";
import type { User } from "../../domain/entities/user.entity";
import type { Project } from "../../domain/entities/project.entity";

export class ApiUserRepository implements UserRepository {
  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`users/${id}`);
    return response.data;
  }

  async getUserProjects(id: string): Promise<Project[]> {
    const response = await api.get<Project[]>(`users/${id}/projects`);
    return response.data;
  }
}
