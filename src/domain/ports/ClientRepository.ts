import type { Client, ClientContact } from "../entities/client.entity";
import type { CreateClientDTO, UpdateClientDTO } from "../../application/dto/client.dto";
import type { Project } from "../entities/project.entity";

export type { Client, ClientContact, CreateClientDTO, UpdateClientDTO, Project };

export interface ClientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ClientRepository {
  getClients(params?: ClientQueryParams): Promise<PaginatedResult<Client>>;
  getClientById(id: string): Promise<Client | null>;
  createClient(dto: CreateClientDTO): Promise<void>;
  updateClient(id: string, dto: UpdateClientDTO): Promise<void>;
  deleteClient(id: string): Promise<void>;
  changeStatus(id: string): Promise<void>;
  getClientProjects(clientId: string): Promise<Project[]>;
  getClientContacts(clientId: string): Promise<ClientContact[]>;
  createContact(clientId: string, contactId: string, contact: any): Promise<void>;
  updateContact(clientId: string, contactId: string, contact: any): Promise<void>;
  deleteContact(clientId: string, contactId: string): Promise<void>;
}
