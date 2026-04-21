// infrastructure/mappers/clientMapper.ts
// Converts between API snake_case and domain camelCase for Client entities

import type { ClientSummary } from "../../domain/models/Client";

// ── Raw API types (snake_case) ──────────────────

export interface ApiClientSummaryResponse {
  id: string;
  name: string;
  is_active: boolean;
  sector: { id: string; name: string };
}

// ── Mappers ─────────────────────────────────────

export function mapClientSummaryToDomain(
  raw: ApiClientSummaryResponse,
): ClientSummary {
  return {
    id: raw.id,
    name: raw.name,
    isActive: raw.is_active,
    sector: raw.sector,
  };
}
