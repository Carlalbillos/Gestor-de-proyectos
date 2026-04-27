import type { User } from "@/domain/entities/user.entity";

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "ROLE_ADMIN" || user?.role === "admin";
};

export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role;
};
