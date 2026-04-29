import type { ClientRepository, Client, Project, ClientContact } from "../../domain/ports/ClientRepository";

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

  async getClientProjects(clientId: string): Promise<Project[]> {
    return await this.clientRepository.getClientProjects(clientId);
  }

  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    return await this.clientRepository.getClientContacts(clientId);
  }
}
