import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class LoggedHours {
  private readonly value: number;

  constructor(value: number) {
    LoggedHours.validate(value);
    this.value = value;
  }

  private static validate(value: number): void {
    if (isNaN(value)) {
      throw new BusinessRuleException("El formato de las horas no es válido.");
    }
    if (value < 0.5) {
      throw new BusinessRuleException("Las horas deben ser mayores o iguales a 0.5.");
    }
    if (value > 24) {
      throw new BusinessRuleException("Las horas no pueden ser mayores a 24.");
    }
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: LoggedHours): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value.toString();
  }
}
