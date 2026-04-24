export interface ProjectClient {
  id: string;
  name: string;
}

export interface Project {
  user_project_id?: string;
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  client?: ProjectClient;
  team_members?: number;
}
