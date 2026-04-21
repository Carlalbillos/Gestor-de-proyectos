// domain/repositories/ProjectRepository.ts

export interface ProjectFilters {
  isActive?: boolean;
  clientId?: string;
  appUserId?: string;
  page?: number;
  limit?: number;
}
