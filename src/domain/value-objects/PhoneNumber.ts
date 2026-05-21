import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class PhoneNumber {
  private readonly value: string;

  constructor(value: string) {
    const cleaned = PhoneNumber.sanitize(value);
    PhoneNumber.validate(cleaned);
    this.value = cleaned;
  }

  private static sanitize(value: string): string {
    return value.replace(/[\s\-\(\)]/g, "");
  }

  private static validate(value: string): void {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(value)) {
      throw new BusinessRuleException(`El formato del número de teléfono "${value}" no es válido.`);
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}
