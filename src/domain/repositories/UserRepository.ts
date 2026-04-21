// domain/repositories/UserRepository.ts
import type { User } from "../models/User";
import type { SystemRole } from "../models/User";

export interface UserFilters {
  isActive?: boolean;
  role?: SystemRole;
  page?: number;
  limit?: number;
}
