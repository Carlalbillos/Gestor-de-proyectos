import { BusinessRuleException } from "../shared/errors/BusinessRuleException";
import type { Technology } from "./technology.entity";
export type { Technology };

export interface ProjectClient {
  id: string;
  name: string;
}

export interface ProjectRole {
  id: string;
  name: string;
}

export interface ProjectUser {
  appUserId: string;
  name: string;
  surname: string;
  role: ProjectRole | null;
  isActive?: boolean;
}


export interface DevelopmentLink {
  id: string;
  environment: string;
  url: string;
}

export interface ProjectDevelopment {
  id: string;
  name: string;
  description: string;
  technology: Technology | null;
  urlRepository: string;
  links: DevelopmentLink[];
}

export class Project {
  readonly id: string;
  name: string;
  description: string;
  isActive: boolean;
  startDate: string;
  client?: ProjectClient | null;
  teamMembers?: number;
  readonly userProjectId?: string;

  constructor(
    id: string,
    name: string,
    description: string,
    isActive: boolean,
    startDate: string,
    client?: ProjectClient | null,
    teamMembers?: number,
    userProjectId?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.startDate = startDate;
    this.client = client;
    this.teamMembers = teamMembers;
    this.userProjectId = userProjectId;
  }

  public rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new BusinessRuleException("El nombre del proyecto no puede estar vacío");
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

export interface ProjectTimeEntry {
  id: string;
  appUserId?: string;
  name: string;
  surname: string;
  date: string;
  hour: number;
  comment: string | null;
}
