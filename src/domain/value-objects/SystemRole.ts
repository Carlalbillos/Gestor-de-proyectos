import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class SystemRole {
  private readonly value: string;

  constructor(value: any) {
    const normalized = SystemRole.normalize(value);
    SystemRole.validate(normalized);
    this.value = normalized;
  }

  private static normalize(value: any): string {
    if (value === undefined || value === null) {
      throw new BusinessRuleException("Rol de usuario inválido");
    }

    if (typeof value === "string") {
      const upper = value.toUpperCase().trim();
      if (upper === "ROLE_ADMIN" || upper === "ADMIN") return "admin";
      if (upper === "ROLE_EMPLOYEE" || upper === "ROLE_USER" || upper === "USER") return "user";
      return value.toLowerCase().trim();
    }

    if (typeof value === "object" && value !== null) {
      const name = value.name || value.id || "";
      return SystemRole.normalize(name);
    }

    return String(value);
  }

  private static validate(value: string): void {
    if (value !== "admin" && value !== "user") {
      throw new BusinessRuleException("Rol de usuario inválido");
    }
  }

  public getValue(): string {
    return this.value;
  }

  public isAdmin(): boolean {
    return this.value === "admin";
  }

  public isUser(): boolean {
    return this.value === "user";
  }

  public equals(other: SystemRole): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}
