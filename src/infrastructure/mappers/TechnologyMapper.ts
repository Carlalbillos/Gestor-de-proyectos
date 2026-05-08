import type { Technology } from "../../domain/entities/technology.entity";

export class TechnologyMapper {
  static toDomain(raw: Technology): Technology {
    return {
      id: raw.id,
      name: raw.name,
    };
  }
}
