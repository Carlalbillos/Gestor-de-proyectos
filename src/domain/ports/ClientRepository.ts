import type { Client, ClientContact, CreateClientDTO, UpdateClientDTO } from "../entities/client.entity";
import type { Project } from "../entities/project.entity";

export type { Client, ClientContact, CreateClientDTO, UpdateClientDTO, Project };

export interface ClientRepository {
  getClients(): Promise<Client[]>;
  getClientById(id: string): Promise<Client | null>;
  createClient(dto: CreateClientDTO): Promise<void>;
  updateClient(id: string, dto: UpdateClientDTO): Promise<void>;
  deleteClient(id: string): Promise<void>;
  getClientProjects(clientId: string): Promise<Project[]>;
  getClientContacts(clientId: string): Promise<ClientContact[]>;
}
