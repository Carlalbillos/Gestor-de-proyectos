import { BusinessRuleException } from "../shared/errors/BusinessRuleException";

export class ProjectRole {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = ProjectRole.normalize(name);
    ProjectRole.validate(this.name);
  }

  private static normalize(name: string): string {
    const upper = name.toUpperCase().trim();
    if (upper === "KEY_ACCOUNT_MANAGER" || upper === "KEY ACCOUNT MANAGER") {
      return "KAM";
    }
    return upper;
  }

  private static validate(name: string): void {
    const validRoles = ["PROJECT_MANAGER", "KAM", "DEVELOPER", "TECH_LEADER"];
    if (!validRoles.includes(name)) {
      throw new BusinessRuleException(`Rol de proyecto no válido: ${name}`);
    }
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getLabel(): string {
    const labels: Record<string, string> = {
      PROJECT_MANAGER: "Project Manager",
      KAM: "KAM",
      DEVELOPER: "Developer",
      TECH_LEADER: "Tech Leader",
    };
    return labels[this.name] ?? this.name.replace(/_/g, " ");
  }

  public equals(other: ProjectRole): boolean {
    return this.id === other.getId() && this.name === other.getName();
  }
}
