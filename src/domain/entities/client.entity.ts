import { Email } from "../value-objects/Email";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export interface ClientSector {
  id: string;
  name: string;
}

export class Client {
  readonly id: string;
  name: string;
  isActive: boolean;
  sector: ClientSector;

  constructor(
    id: string,
    name: string,
    isActive: boolean,
    sector: ClientSector
  ) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.sector = sector;
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleException("El nombre del cliente no puede estar vacío");
    }
    this.name = newName.trim();
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }
}

export interface ClientContact {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  email: Email | null;
  isMain: boolean;
  note: string | null;
}