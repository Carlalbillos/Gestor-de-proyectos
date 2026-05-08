import type { User, TimeEntry } from "../../domain/entities/user.entity";
import { Email } from "../../domain/value-objects/Email";

export class UserMapper {
  static toDomain(raw: any): User {
    return {
      id: raw.id,
      name: raw.name,
      surname: raw.surname,
      email: new Email(raw.email),
      role: UserMapper.fromApiRole(raw.role),
      isActive: Boolean(raw.is_active),
    };
  }

  static toApiRole(role: string): string {
    if (role === 'admin') return 'ROLE_ADMIN';
    if (role === 'user') return 'ROLE_EMPLOYEE';
    return role;
  }

  static fromApiRole(role: any): string {

    if (role === 'ROLE_ADMIN') return 'admin';
    if (role === 'ROLE_EMPLOYEE') return 'user';
    return role;
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
