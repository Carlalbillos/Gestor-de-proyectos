import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getClients(): Promise<Client[]> {
    return await this.clientRepository.getClients();
  }
}
