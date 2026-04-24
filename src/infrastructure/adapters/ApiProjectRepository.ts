import { api } from "./AxiosHttpClient";
import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../domain/ports/ProjectRepository";
import type { Project } from "../../domain/entities/project.entity";

export class ApiProjectRepository implements ProjectRepository {
  async getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    const response = await api.get<any>("/projects", { params });

    const data = response.data.items
    const total = response.data.total

    return { data, total };
  }
}
