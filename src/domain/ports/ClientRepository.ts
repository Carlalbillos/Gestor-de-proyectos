import type { Client, ClientContact, CreateClientDTO } from "../entities/client.entity";
import type { Project } from "../entities/project.entity";

export type { Client, ClientContact, CreateClientDTO, Project };

export interface ClientRepository {
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  createClient(dto: CreateClientDTO): Promise<void>;
  getClientProjects(clientId: string): Promise<Project[]>;
  getClientContacts(clientId: string): Promise<ClientContact[]>;
}
