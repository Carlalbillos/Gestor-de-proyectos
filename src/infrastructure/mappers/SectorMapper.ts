import type { Sector } from "../../domain/entities/sector.entity";

export class SectorMapper {
  static capitalize(name: string): string {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  static toDomain(raw: any): Sector {
    return {
      id: raw.id,
      name: SectorMapper.capitalize(raw.name),
    };
  }
}
