import type { User } from "@/domain/entities/user.entity";

const getRoleName = (user: User | null): string | undefined => {
  if (!user) return undefined;

  const role = user.role as unknown;
  if (typeof role === "string") {
    return role;
  }

  if (role && typeof role === "object" && "name" in role) {
    const roleObj = role as { name: unknown };
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
  return getRoleName(user) === role;
};
