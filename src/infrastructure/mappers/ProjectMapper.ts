import { Project } from "../../domain/entities/project.entity";
import type { ProjectUser, ProjectDevelopment, DevelopmentLink, ProjectRole, ProjectTimeEntry } from "../../domain/entities/project.entity";
import type {
  ApiProjectResponse,
  ApiProjectUserResponse,
  ApiProjectDevelopmentResponse,
  ApiProjectRoleResponse,
  ApiProjectTimeEntryResponse,
} from "../http/responses/api-responses";

export class ProjectMapper {
  static toDomain(raw: ApiProjectResponse): Project {
    return new Project(
      raw.id,
      raw.name,
      raw.description,
      Boolean(raw.is_active),
      raw.start_date,
      raw.client ? {
        id: raw.client.id,
        name: raw.client.name,
      } : null,
      typeof raw.team_members === "number"
        ? raw.team_members
        : Array.isArray(raw.team_members)
        ? raw.team_members.length
        : undefined,
      raw.user_project_id
    );
  }

  static toUserDomain(raw: ApiProjectUserResponse): ProjectUser {
    return {
      appUserId: raw.app_user_id,
      name: raw.name,
      surname: raw.surname,
      role: raw.role ? {
        id: raw.role.id,
        name: raw.role.name,
      } : null,
      isActive: raw.is_user_active !== undefined ? Boolean(raw.is_user_active) : true,
    };
  }

  static toDevelopmentDomain(raw: ApiProjectDevelopmentResponse): ProjectDevelopment {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      technology: raw.technology ? {
        id: raw.technology.id,
        name: raw.technology.name,
      } : null,
      urlRepository: raw.url_repository,
      links: (raw.links || []).map((link): DevelopmentLink => ({
        id: link.id,
        environment: link.environment,
        url: link.url,
      })),
    };
  }

  static toRoleDomain(raw: ApiProjectRoleResponse): ProjectRole {
    return {
      id: raw.id,
      name: raw.name,
    };
  }

  static toTimeEntryDomain(raw: ApiProjectTimeEntryResponse): ProjectTimeEntry {
    return {
      id: raw.id,
      appUserId: raw.app_user_id,
      name: raw.name,
      surname: raw.surname,
      date: raw.date,
      hour: Number(raw.hour),
      comment: raw.comment || null,
    };
  }
}
