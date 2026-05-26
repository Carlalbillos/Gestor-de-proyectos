import type { Client, ClientContact } from "../entities/client.entity";
import type { Project } from "../entities/project.entity";
import type { PaginatedResult } from "../shared/types/PaginatedResult";

// Re-export DTOs and shared types for backward compatibility
export type { PaginatedResult } from "../shared/types/PaginatedResult";
export type { Client, ClientContact, Project };
export type {
  CreateClientDTO,
  UpdateClientDTO,
  CreateContactDTO,
  UpdateContactDTO,
  ClientQueryParams,
} from "../dtos/client.dto";

import type {
  CreateClientDTO,
  UpdateClientDTO,
  CreateContactDTO,
  UpdateContactDTO,
  ClientQueryParams,
} from "../dtos/client.dto";

export interface ClientRepository {
  getClients(params?: ClientQueryParams): Promise<PaginatedResult<Client>>;
  getClientById(id: string): Promise<Client | null>;
  createClient(dto: CreateClientDTO): Promise<void>;
  updateClient(id: string, dto: UpdateClientDTO): Promise<void>;
  deleteClient(id: string): Promise<void>;
  changeStatus(id: string): Promise<void>;
  getClientProjects(clientId: string): Promise<Project[]>;
  getClientContacts(clientId: string): Promise<ClientContact[]>;
  createContact(clientId: string, contactId: string, contact: CreateContactDTO): Promise<void>;
  updateContact(clientId: string, contactId: string, contact: UpdateContactDTO): Promise<void>;
  setMainContact(clientId: string, contactId: string): Promise<void>;
  deleteContact(clientId: string, contactId: string): Promise<void>;
}
