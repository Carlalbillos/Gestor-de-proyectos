import type { ClientRepository, UpdateClientDTO } from "../../../domain/ports/ClientRepository";

export class UpdateClientUseCase {
  private clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string, dto: UpdateClientDTO): Promise<void> {
    return await this.clientRepository.updateClient(id, dto);
  }
}
