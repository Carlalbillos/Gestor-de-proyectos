import type { Technology } from "../../domain/entities/technology.entity";
import type { ApiTechnologyResponse } from "../http/responses/api-responses";

export class TechnologyMapper {
  static toDomain(raw: ApiTechnologyResponse): Technology {
    return {
      id: raw.id,
      name: raw.name,
    };
  }
}
