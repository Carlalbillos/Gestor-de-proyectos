import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

export class ClientService {
  private readonly clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async getClients(): Promise<Client[]> {
    return await this.clientRepository.getClients();
  }

  async getClientById(id: string): Promise<Client | null> {
    return await this.clientRepository.getClientById(id);
  }

  async createClient(client: Client): Promise<void> {
    return await this.clientRepository.createClient(client);
  }

  async getClientsByProjectId(projectId: string): Promise<Client[]> {
    return await this.clientRepository.getClientsByProjectId(projectId);
  }

  async getClientsByContactId(contactId: string): Promise<Client[]> {
    return await this.clientRepository.getClientsByContactId(contactId);
  }
}
