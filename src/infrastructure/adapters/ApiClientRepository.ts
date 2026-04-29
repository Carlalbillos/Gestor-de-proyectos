import { api } from "./AxiosHttpClient";
import type { ClientRepository, Client } from "../../domain/ports/ClientRepository";

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

  async createClient(client: Client): Promise<void> {
    await api.post("clients", {
      name: client.name,
      sector_id: client.sector.id,
    });
  }

  async getClientsByProjectId(projectId: string): Promise<Client[]> {
    const response = await api.get<Client[]>(`projects/${projectId}/clients`);
    return response.data;
  }

  async getClientsByContactId(contactId: string): Promise<Client[]> {
    const response = await api.get<Client[]>(`contacts/${contactId}/clients`);
    return response.data;
  }
}
