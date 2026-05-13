import { api } from "./AxiosHttpClient";
import type { ProjectRepository, ProjectQueryParams, PaginatedResult, ProjectTimeEntryQueryParams } from "../../domain/ports/ProjectRepository";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry } from "../../domain/entities/project.entity";
import type { CreateProjectDTO } from "../../application/dto/project/CreateProject.dto";
import type { UpdateProjectDTO } from "../../application/dto/project/UpdateProject.dto";
import type { CreateDevelopmentDTO } from "../../application/dto/project/CreateDevelopment.dto";
import type { UpdateDevelopmentDTO } from "../../application/dto/project/UpdateDevelopment.dto";
import type { UpdateTimeEntryDTO } from "../../application/dto/user/UpdateTimeEntry.dto";
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

  async updateProject(id: string, project: UpdateProjectDTO): Promise<void> {
    await api.put(`projects/${id}`, {
      name: project.name,
      description: project.description,
      start_date: project.startDate,
      is_active: project.isActive,
      client_id: project.clientId,
    });
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

  async getProjectTimeEntries(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]> {
    const queryParams: any = {};
    if (params) {
      if (params.from) queryParams.from = params.from;
      if (params.to) queryParams.to = params.to;
      if (params.app_user_id) queryParams.app_user_id = params.app_user_id;
      if (params.min_hour !== undefined) queryParams.min_hour = params.min_hour;
      if (params.max_hour !== undefined) queryParams.max_hour = params.max_hour;
      if (params.has_comment !== undefined) queryParams.has_comment = params.has_comment;
      if (params.sort_by) queryParams.sort_by = params.sort_by;
      if (params.sort_order) queryParams.sort_order = params.sort_order;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
    }
    const response = await api.get<any[]>(`projects/${id}/time-entries`, { params: queryParams });
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toTimeEntryDomain);
  }

  async assignUser(projectId: string, userId: string, roleId: string): Promise<void> {
    await api.post(`projects/${projectId}/users`, {
      app_user_id: userId,
      project_role_id: roleId,
    });
  }

  async updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void> {
    await Promise.all(
      users.map(user =>
        api.put(`projects/${projectId}/users`, {
          app_user_id: user.appUserId,
          project_role_id: user.roleId,
        })
      )
    );
  }

  async removeUser(projectId: string, userId: string): Promise<void> {
    await api.delete(`projects/${projectId}/users/${userId}`);
  }

  async updateProjectTimeEntry(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void> {
    await api.put(`projects/${projectId}/time-entries/${entryId}`, data);
  }

  async deleteProjectTimeEntry(projectId: string, entryId: string): Promise<void> {
    await api.delete(`projects/${projectId}/time-entries/${entryId}`);
  }

  async changeStatus(id: string): Promise<void> {
    await api.patch(`projects/${id}/change-status`);
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`projects/${id}`);
  }

  async createDevelopment(projectId: string, development: CreateDevelopmentDTO): Promise<void> {
    await api.post(`projects/${projectId}/developments`, {
      id: development.id,
      name: development.name,
      description: development.description,
      technology_id: development.technologyId,
      url_repository: development.urlRepository,
    });
  }

  async updateDevelopment(projectId: string, development: UpdateDevelopmentDTO): Promise<void> {
    await api.put(`projects/${projectId}/developments`, {
      id: development.id,
      name: development.name,
      description: development.description,
      technology_id: development.technologyId,
      url_repository: development.urlRepository,
      links: development.links,
    });
  }

  async deleteDevelopment(projectId: string, developmentId: string): Promise<void> {
    await api.delete(`projects/${projectId}/developments/${developmentId}`);
  }
}
