import { api } from "./AxiosHttpClient";
import type { ClientRepository, Client, ClientContact, CreateClientDTO, UpdateClientDTO, Project } from "../../domain/ports/ClientRepository";
import { ClientMapper } from "../mappers/ClientMapper";
import { ProjectMapper } from "../mappers/ProjectMapper";

export class ApiClientRepository implements ClientRepository {
  async getClients(): Promise<Client[]> {
    const response = await api.get<any[]>("clients");
    return response.data.map(ClientMapper.toDomain);
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      const response = await api.get<any>(`clients/${id}`);
      return ClientMapper.toDomain(response.data);
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
      sector_id: dto.sectorId,
    });
  }

  async updateClient(id: string, dto: UpdateClientDTO): Promise<void> {
    await api.put(`clients/${id}`, {
      name: dto.name,
      sector_id: dto.sectorId,
      is_active: dto.isActive,
    });
  }

  async deleteClient(id: string): Promise<void> {
    await api.delete(`clients/${id}`);
  }

  async changeStatus(id: string): Promise<void> {
    await api.patch(`clients/${id}/change-status`);
  }

  async getClientProjects(clientId: string): Promise<Project[]> {
    const response = await api.get<any[]>(`clients/${clientId}/projects`);
    return (Array.isArray(response.data) ? response.data : []).map(ProjectMapper.toDomain);
  }

  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    const response = await api.get<any[]>(`clients/${clientId}/contacts`);
    return (Array.isArray(response.data) ? response.data : []).map(ClientMapper.toContactDomain);
  }

  async createContact(clientId: string, contactId: string, contact: any): Promise<void> {
    await api.post(`clients/${clientId}/contacts/${contactId}`, {
      full_name: contact.fullName,
      phone_number: contact.phoneNumber,
      email: contact.email,
      is_active: contact.isActive,
      is_main: contact.isMain,
      note: contact.note,
    });
  }

  async updateContact(clientId: string, contactId: string, contact: any): Promise<void> {
    await api.put(`clients/${clientId}/contacts/${contactId}`, {
      full_name: contact.fullName,
      phone_number: contact.phoneNumber,
      email: contact.email,
      is_active: contact.isActive,
      is_main: contact.isMain,
      note: contact.note,
    });
  }

  async deleteContact(clientId: string, contactId: string): Promise<void> {
    await api.delete(`clients/${clientId}/contacts/${contactId}`);
  }
}
