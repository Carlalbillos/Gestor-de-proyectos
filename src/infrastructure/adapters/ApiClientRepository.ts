import { api } from "./AxiosHttpClient";
import type { ClientRepository, Client, ClientContact, CreateClientDTO, Project } from "../../domain/ports/ClientRepository";

export class ApiClientRepository implements ClientRepository {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>("clients");
    return response.data;
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const response = await api.get<Client>(`clients/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createClient(dto: CreateClientDTO): Promise<void> {
    await api.post("clients", {
      id: dto.id,
      name: dto.name,
      sector_id: dto.sector_id,
    });
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    const response = await api.get<Project[]>(`clients/${clientId}/projects`);
    return response.data;
  }

  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    const response = await api.get<ClientContact[]>(`clients/${clientId}/contacts`);
    return response.data;
  }
}
