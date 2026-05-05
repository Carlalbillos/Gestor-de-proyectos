import type { Sector } from "../../domain/entities/sector.entity";

export class SectorMapper {
  static toDomain(raw: any): Sector {
    return {
      id: raw.id,
      name: raw.name,
    };
  }
}
