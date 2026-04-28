import type { User } from "@/domain/entities/user.entity";

const getRoleName = (user: User | null): string | undefined => {
  if (!user) return undefined;

  if (typeof user.role === "string") {
    return user.role;
  }

  return (user.role as any)?.name;
};

export const isAdmin = (user: User | null): boolean => {
  const roleName = getRoleName(user);
  return roleName === "ROLE_ADMIN" || roleName === "admin";
};

export const hasRole = (user: User | null, role: string): boolean => {
  return getRoleName(user) === role;
};
