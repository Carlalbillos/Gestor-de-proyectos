export interface ProjectClient {
  id: string;
  name: string;
}

export interface ProjectRole {
  id: string;
  name: string;
}

export interface ProjectUser {
  app_user_id: string;
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
  url_repository: string;
  links: DevelopmentLink[];
}

export interface Project {
  user_project_id?: string;
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_date: string;
  client?: ProjectClient | null;
  team_members?: number;
}

export interface CreateProjectDTO {
  id: string;
  name: string;
  description: string;
  start_date: string;
  client_id: string;
}
