import type { ProjectRepository, ProjectQueryParams, PaginatedResult, ProjectTimeEntryQueryParams } from "../../domain/ports/ProjectRepository";
import type { Project, ProjectUser, ProjectDevelopment, ProjectRole, ProjectTimeEntry } from "../../domain/entities/project.entity";
import type { CreateProjectDTO, UpdateProjectDTO, CreateDevelopmentDTO, UpdateDevelopmentDTO } from "../dto/project.dto";
import type { UpdateTimeEntryDTO } from "../dto/user.dto";

export class ProjectService {
  private readonly projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  async getProjectsList(params?: ProjectQueryParams): Promise<PaginatedResult<Project>> {
    return await this.projectRepository.getProjects(params);
  }

  async getProjectById(id: string): Promise<Project> {
    return await this.projectRepository.getProjectById(id);
  }

  async createProject(project: CreateProjectDTO): Promise<void> {
    return await this.projectRepository.createProject(project);
  }

  async updateProject(id: string, project: UpdateProjectDTO): Promise<void> {
    return await this.projectRepository.updateProject(id, project);
  }

  async getProjectUsers(id: string): Promise<ProjectUser[]> {
    return await this.projectRepository.getProjectUsers(id);
  }

  async getProjectDevelopments(id: string): Promise<ProjectDevelopment[]> {
    return await this.projectRepository.getProjectDevelopments(id);
  }

  async getProjectRoles(): Promise<ProjectRole[]> {
    return await this.projectRepository.getProjectRoles();
  }

  async assignUser(projectId: string, userId: string, roleId: string): Promise<void> {
    return await this.projectRepository.assignUser(projectId, userId, roleId);
  }

  async updateProjectUsers(projectId: string, users: { appUserId: string, roleId: string }[]): Promise<void> {
    return await this.projectRepository.updateProjectUsers(projectId, users);
  }

  async removeUser(projectId: string, userId: string): Promise<void> {
    return await this.projectRepository.removeUser(projectId, userId);
  }

  async getProjectTimeEntries(id: string, params?: ProjectTimeEntryQueryParams): Promise<ProjectTimeEntry[]> {
    return await this.projectRepository.getProjectTimeEntries(id, params);
  }

  async updateProjectTimeEntry(projectId: string, entryId: string, data: UpdateTimeEntryDTO): Promise<void> {
    return await this.projectRepository.updateProjectTimeEntry(projectId, entryId, data);
  }

  async deleteProjectTimeEntry(projectId: string, entryId: string): Promise<void> {
    return await this.projectRepository.deleteProjectTimeEntry(projectId, entryId);
  }

  async changeStatus(id: string): Promise<void> {
    return await this.projectRepository.changeStatus(id);
  }

  async deleteProject(id: string): Promise<void> {
    return await this.projectRepository.deleteProject(id);
  }

  async createDevelopment(projectId: string, development: CreateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.createDevelopment(projectId, development);
  }

  async updateDevelopment(projectId: string, development: UpdateDevelopmentDTO): Promise<void> {
    return await this.projectRepository.updateDevelopment(projectId, development);
  }

  async deleteDevelopment(projectId: string, developmentId: string): Promise<void> {
    return await this.projectRepository.deleteDevelopment(projectId, developmentId);
  }
}
