import type { Client, ClientContact } from "../entities/client.entity";
import type { Project } from "../entities/project.entity";

export type { Client, ClientContact, Project };

export interface ClientRepository {
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  createClient(client: Client): Promise<void>;
  getClientProjects(clientId: string): Promise<Project[]>;
  getClientContacts(clientId: string): Promise<ClientContact[]>;
}
