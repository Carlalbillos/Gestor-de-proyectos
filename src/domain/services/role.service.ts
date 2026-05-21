import type { User } from "@/domain/entities/user.entity";

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role.isAdmin();
};

export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  const roleName = user.role.getValue();
  return (
    roleName === role ||
    (roleName === "admin" && (role === "admin" || role === "ROLE_ADMIN")) ||
    (roleName === "user" && (role === "user" || role === "ROLE_USER" || role === "ROLE_EMPLOYEE"))
  );
};
