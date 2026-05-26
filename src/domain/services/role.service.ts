import type { User } from "@/domain/entities/user.entity";
import { SystemRole } from "../value-objects";

const getRoleName = (user: User | null): string | undefined => {
  if (!user) return undefined;

  if (typeof user.role === "string") {
    return user.role;
  }

  if (user.role && typeof user.role.getValue === "function") {
    return user.role.getValue();
  }

  if (user.role && typeof user.role === "object") {
    const roleObj = (user.role as unknown) as Record<string, unknown>;
    if (typeof roleObj.value === "string") {
      return roleObj.value;
    }
    if (typeof roleObj.name === "string") {
      return roleObj.name;
    }
  }

  return undefined;
};

export const isAdmin = (user: User | null): boolean => {
  const roleName = getRoleName(user);
  return roleName === "ROLE_ADMIN" || roleName === "admin";
};

export const hasRole = (user: User | null, role: string): boolean => {
  const userRole = getRoleName(user);
  if (!userRole) return false;

  try {
    const normalizedTarget = new SystemRole(role).getValue();
    const normalizedUserRole = new SystemRole(userRole).getValue();
    return normalizedUserRole === normalizedTarget;
  } catch {
    return userRole === role;
  }
};
