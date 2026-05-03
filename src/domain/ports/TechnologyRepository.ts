import type { Technology } from "../entities/technology.entity";

export interface CreateTechnologyDTO {
  id: string;
  name: string;
}

export interface TechnologyRepository {
  getTechnologies(): Promise<Technology[]>;
  createTechnology(dto: CreateTechnologyDTO): Promise<void>;
}
