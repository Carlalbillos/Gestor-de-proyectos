import type { Project, ProjectUser, ProjectDevelopment, DevelopmentLink } from "../../domain/entities/project.entity";

export class ProjectMapper {
  static toDomain(raw: any): Project {
    return {
      userProjectId: raw.user_project_id,
      id: raw.id,
      name: raw.name,
      description: raw.description,
      isActive: Boolean(raw.is_active),
      startDate: raw.start_date,
      client: raw.client ? {
        id: raw.client.id,
        name: raw.client.name,
      } : null,
      teamMembers: raw.team_members,
    };
  }

  static toUserDomain(raw: any): ProjectUser {
    return {
      appUserId: raw.app_user_id,
      name: raw.name,
      surname: raw.surname,
      role: raw.role ? {
        id: raw.role.id,
        name: raw.role.name,
      } : null,
    };
  }

  static toDevelopmentDomain(raw: any): ProjectDevelopment {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      technology: raw.technology ? {
        id: raw.technology.id,
        name: raw.technology.name,
      } : null,
      urlRepository: raw.url_repository,
      links: (raw.links || []).map((link: any): DevelopmentLink => ({
        id: link.id,
        environment: link.environment,
        url: link.url,
      })),
    };
  }
}
