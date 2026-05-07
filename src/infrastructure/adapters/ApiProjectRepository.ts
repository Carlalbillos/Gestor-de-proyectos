import { api } from "./AxiosHttpClient";
import type { ProjectRepository, ProjectQueryParams, PaginatedResult } from "../../domain/ports/ProjectRepository";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole } from "../../domain/entities/project.entity";
import type { CreateProjectDTO } from "../../application/dto/project.dto";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ApiProjectRepository implements ProjectRepository {
  async getProjects(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    const queryParams: any = {};
    if (params?.page) {
      queryParams.page = params.page;
    }
    if (params?.limit) {
      queryParams.limit = params.limit;
    }
    if (params?.clientId) {
      queryParams.client_id = params.clientId;
    }
    if (params?.appUserId) {
      queryParams.app_user_id = params.appUserId;
    }
    if (typeof params?.isActive === "boolean") {
      queryParams.is_active = params.isActive;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }

    const response = await api.get<any[]>("projects", { params: queryParams });

    const rawData = Array.isArray(response.data) ? response.data : [];
    const data = rawData.map(ProjectMapper.toDomain);
    const total = data.length;

    return { data, total };
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<any>(`projects/${id}`);
    return ProjectMapper.toDomain(response.data);
  }

  async createProject(project: CreateProjectDTO): Promise<void> {
    await api.post("projects", {
      id: project.id,
      name: project.name,
      description: project.description,
      start_date: project.startDate,
      client_id: project.clientId,
    });
  }

  async getProjectUsers(id: string): Promise<ProjectUser[]> {
    const response = await api.get<any[]>(`projects/${id}/users`);
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toUserDomain);
  }

  async getProjectDevelopments(id: string): Promise<ProjectDevelopment[]> {
    const response = await api.get<any[]>(`projects/${id}/developments`);
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toDevelopmentDomain);
  }

  async getProjectRoles(): Promise<ProjectRole[]> {
    const response = await api.get<any[]>("project-roles");
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toRoleDomain);
  }

  async assignUser(projectId: string, userId: string, roleId: string): Promise<void> {
    await api.post(`projects/${projectId}/users`, {
      app_user_id: userId,
      project_role_id: roleId,
    });
  }

  async updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void> {
    await api.put(`projects/${projectId}/users`, {
      users: users.map(u => ({
        app_user_id: u.appUserId,
        project_role_id: u.roleId,
      })),
    });
  }

  async removeUser(projectId: string, userId: string): Promise<void> {
    await api.delete(`projects/${projectId}/users/${userId}`);
  }
}
