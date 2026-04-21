export interface ClientSummary {
  id: string;
  name: string;
  isActive: boolean;
  sector: { id: string; name: string };
}
