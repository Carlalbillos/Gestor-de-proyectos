import { User } from "../../domain/entities/user.entity";
import type { TimeEntry } from "../../domain/entities/user.entity";
import { Email, SystemRole, LoggedHours } from "../../domain/value-objects";
import type { ApiUserResponse, ApiTimeEntryResponse } from "../http/responses/api-responses";

export class UserMapper {
  static toDomain(raw: ApiUserResponse): User {
    return new User(
      raw.id,
      raw.name,
      raw.surname,
      new Email(raw.email),
      new SystemRole(raw.role),
      Boolean(raw.is_active)
    );
  }

  static toApiRole(role: string): string {
    if (role === 'admin') return 'ROLE_ADMIN';
    if (role === 'user') return 'ROLE_EMPLOYEE';
    return role;
  }

  static fromApiRole(role: any): string {
    if (!role) return 'user';
    if (typeof role === 'string') {
      if (role === 'ROLE_ADMIN') return 'admin';
      if (role === 'ROLE_EMPLOYEE') return 'user';
      return role;
    }
    if (typeof role === 'object' && role !== null) {
      const name = role.name || role.id || '';
      if (name === 'ROLE_ADMIN') return 'admin';
      if (name === 'ROLE_EMPLOYEE') return 'user';
      return name;
    }
    return String(role);
  }

  static toTimeEntryDomain(raw: ApiTimeEntryResponse): TimeEntry {
    return {
      id: raw.id,
      date: raw.date,
      hour: new LoggedHours(Number(raw.hour)),
      comment: raw.comment || "",
      project: raw.project ? {
        id: raw.project.id,
        name: raw.project.name,
      } : { id: "", name: "" },
    };
  }
}
