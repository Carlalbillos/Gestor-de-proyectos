import type { Client } from "../entities/client.entity";

export type { Client };

export interface ClientRepository {
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  createClient(client: Client): Promise<void>;
  getClientsByProjectId(projectId: string): Promise<Client[]>;
  getClientsByContactId(contactId: string): Promise<Client[]>;
}
