import type { ClientRepository, Client, CreateClientDTO, UpdateClientDTO, Project, ClientContact, ClientQueryParams, PaginatedResult } from "../../domain/ports/ClientRepository";

export class ClientService {
  private readonly clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async getClients(params?: ClientQueryParams): Promise<PaginatedResult<Client>> {
    return await this.clientRepository.getClients(params);
  }

  async getClientById(id: string): Promise<Client | null> {
    return await this.clientRepository.getClientById(id);
  }

  async createClient(dto: CreateClientDTO): Promise<void> {
    return await this.clientRepository.createClient(dto);
  }

  async updateClient(id: string, dto: UpdateClientDTO): Promise<void> {
    return await this.clientRepository.updateClient(id, dto);
  }

  async deleteClient(id: string): Promise<void> {
    return await this.clientRepository.deleteClient(id);
  }

  async changeStatus(id: string): Promise<void> {
    return await this.clientRepository.changeStatus(id);
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    return await this.clientRepository.getClientProjects(clientId);
  }

  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    return await this.clientRepository.getClientContacts(clientId);
  }

  async createContact(clientId: string, contactId: string, contact: any): Promise<void> {
    return await this.clientRepository.createContact(clientId, contactId, contact);
  }

  async updateContact(clientId: string, contactId: string, contact: any): Promise<void> {
    return await this.clientRepository.updateContact(clientId, contactId, contact);
  }

  async deleteContact(clientId: string, contactId: string): Promise<void> {
    return await this.clientRepository.deleteContact(clientId, contactId);
  }
}
