import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

export class ClientService {
  private readonly clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async getClients(): Promise<Client[]> {
    return await this.clientRepository.getClients();
  }
}
