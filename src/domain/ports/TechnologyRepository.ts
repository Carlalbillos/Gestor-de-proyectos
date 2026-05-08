import type { Technology } from "../entities/technology.entity";
import type { CreateTechnologyDTO } from "../../application/dto/technology.dto";
import type { UpdateTechnologyDTO } from "../../application/dto/technology.dto";

export interface TechnologyRepository {
  getTechnologies(): Promise<Technology[]>;
  createTechnology(dto: CreateTechnologyDTO): Promise<void>;
  updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<void>;
  deleteTechnology(id: string): Promise<void>;
}
