// infrastructure/mappers/userMapper.ts
// Converts between API snake_case and domain camelCase for User entities

import type { User, SystemRole } from "../../domain/models/User";

// ── Raw API types (snake_case) ──────────────────

export interface ApiUserResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  first_time: boolean;
  is_active: boolean;
  role: SystemRole;
}

export interface ApiUserCreateRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: SystemRole;
}

export interface ApiUserUpdateRequest {
  name: string;
  surname: string;
  email: string;
  is_active: boolean;
  role: SystemRole;
}

export interface ApiUserPasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface ApiUserAdminPasswordChangeRequest {
  new_password: string;
}

// ── Mappers ─────────────────────────────────────

export function mapUserToDomain(raw: ApiUserResponse): User {
  return {
    id: raw.id,
    name: raw.name,
    surname: raw.surname,
    email: raw.email,
    firstTime: raw.first_time,
    isActive: raw.is_active,
    role: raw.role,
  };
}

export function mapUserCreateToApi(
  data: Omit<User, "id" | "isActive" | "firstTime"> & { password: string },
): ApiUserCreateRequest {
  return {
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
    role: data.role,
  };
}

export function mapUserUpdateToApi(
  data: Partial<User>,
): Partial<ApiUserUpdateRequest> {
  const result: Partial<ApiUserUpdateRequest> = {};

  if (data.name !== undefined) result.name = data.name;
  if (data.surname !== undefined) result.surname = data.surname;
  if (data.email !== undefined) result.email = data.email;
  if (data.isActive !== undefined) result.is_active = data.isActive;
  if (data.role !== undefined) result.role = data.role;

  return result;
}
