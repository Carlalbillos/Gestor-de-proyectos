import type { Technology } from "../entities/technology.entity";
import type { CreateTechnologyDTO } from "../../application/dto/technology/CreateTechnology.dto";
import type { UpdateTechnologyDTO } from "../../application/dto/technology/UpdateTechnology.dto";

export interface TechnologyRepository {
  getTechnologies(): Promise<Technology[]>;
  createTechnology(dto: CreateTechnologyDTO): Promise<void>;
  updateTechnology(id: string, dto: UpdateTechnologyDTO): Promise<void>;
  deleteTechnology(id: string): Promise<void>;
}
