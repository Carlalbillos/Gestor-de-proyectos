import type { Technology } from "../entities/technology.entity";

// Re-export DTOs for backward compatibility
export type { CreateTechnologyDTO, UpdateTechnologyDTO } from "../dtos/technology.dto";

import type { CreateTechnologyDTO, UpdateTechnologyDTO } from "../dtos/technology.dto";

export interface TechnologyRepository {
  getTechnologies(): Promise<Technology[]>;
  createTechnology(dto: CreateTechnologyDTO): Promise<void>;
  updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<void>;
  deleteTechnology(id: string): Promise<void>;
}
