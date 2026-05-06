export class Email {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value.toLowerCase().trim();
  }

  private validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`El formato del email "${value}" no es válido.`);
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}
