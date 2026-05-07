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
