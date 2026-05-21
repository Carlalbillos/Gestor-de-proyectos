import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class Url {
  private readonly value: string;

  constructor(value: string) {
    const formatted = Url.normalize(value);
    Url.validate(formatted);
    this.value = formatted;
  }

  private static normalize(value: string): string {
    return value.trim();
  }

  private static validate(value: string): void {
    try {
      new URL(value);
    } catch (e) {
      throw new BusinessRuleException(`El formato de la URL "${value}" no es válido.`);
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Url): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}
