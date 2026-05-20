export interface CreateClientDTO {
  id: string;
  name: string;
  sectorId: string;
}

export interface UpdateClientDTO {
  name?: string;
  sectorId?: string;
  isActive?: boolean;
}

export interface CreateContactDTO {
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  note: string | null;
}

export interface UpdateContactDTO {
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  isMain: boolean;
  note: string | null;
}

export interface ClientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
