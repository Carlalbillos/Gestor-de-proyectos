import { api } from "./AxiosHttpClient";
import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../domain/ports/ProjectRepository";
import type { Project, ProjectUser, ProjectDevelopment, CreateProjectDTO } from "../../domain/entities/project.entity";

export class ApiProjectRepository implements ProjectRepository {
  async getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    const queryParams: any = {};
    if (params?.page) {
      queryParams.page = params.page;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }
    if (params?.client_id) {
      queryParams.client_id = params.client_id;
    }
    if (params?.app_user_id) {
      queryParams.app_user_id = params.app_user_id;
    }
    if (typeof params?.is_active === "boolean") {
      queryParams.is_active = params.is_active;
    }

    const response = await api.get<Project[]>("projects", { params: queryParams });

    const data = Array.isArray(response.data) ? response.data : [];
    const total = data.length;

    return { data, total };
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`projects/${id}`);
    return response.data;
  }

  async createProject(project: CreateProjectDTO): Promise<void> {
    await api.post("projects", project);
  }

  async getProjectUsers(id: string): Promise<ProjectUser[]> {
    const response = await api.get<ProjectUser[]>(`projects/${id}/users`);
    return response.data;
  }

  async getProjectDevelopments(id: string): Promise<ProjectDevelopment[]> {
    const response = await api.get<ProjectDevelopment[]>(`projects/${id}/developments`);
    return response.data;
  }
}
