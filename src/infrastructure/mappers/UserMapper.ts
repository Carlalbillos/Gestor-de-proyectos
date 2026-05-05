import type { User, TimeEntry } from "../../domain/entities/user.entity";

export class UserMapper {
  static toDomain(raw: any): User {
    return {
      id: raw.id,
      name: raw.name,
      surname: raw.surname,
      email: raw.email,
      role: raw.role,
      isActive: Boolean(raw.is_active),
    };
  }

  static toTimeEntryDomain(raw: any): TimeEntry {
    return {
      id: raw.id,
      projectUserId: raw.project_user_id,
      date: raw.date,
      hour: Number(raw.hour),
      comment: raw.comment,
      project: raw.project ? {
        id: raw.project.id,
        name: raw.project.name,
      } : { id: '', name: '' },
    };
  }
}
