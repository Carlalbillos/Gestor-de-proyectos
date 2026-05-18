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
}

export interface Technology {
  id: string;
  name: string;
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

export interface Project {
  userProjectId?: string;
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  startDate: string;
  client?: ProjectClient | null;
  teamMembers?: number;
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

