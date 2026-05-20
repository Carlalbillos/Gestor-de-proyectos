import { Email } from "../value-objects/Email";
import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class User {
  readonly id: string;
  name: string;
  surname: string;
  email: Email;
  role: string;
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: Email,
    role: string,
    isActive: boolean
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
  }

  public updateName(name: string, surname: string): void {
    if (!name || name.trim().length === 0) {
      throw new BusinessRuleException("El nombre del usuario no puede estar vacío");
    }
    if (!surname || surname.trim().length === 0) {
      throw new BusinessRuleException("El apellido del usuario no puede estar vacío");
    }
    this.name = name.trim();
    this.surname = surname.trim();
  }

  public changeRole(newRole: string): void {
    if (newRole !== "admin" && newRole !== "user") {
      throw new BusinessRuleException("Rol de usuario inválido");
    }
    this.role = newRole;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }
}

export interface TimeEntry {
  id: string;
  date: string;
  hour: number;
  comment: string;
  project: {
    id: string;
    name: string;
  };
}

export interface TimeEntriesResponse {
  totalHours: number;
  data: TimeEntry[];
}
