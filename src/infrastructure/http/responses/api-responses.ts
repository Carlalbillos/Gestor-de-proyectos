export interface ApiSectorResponse {
  id: string;
  name: string;
}

export interface ApiTechnologyResponse {
  id: string;
  name: string;
}

export interface ApiClientResponse {
  id: string;
  name: string;
  is_active: boolean;
  sector?: ApiSectorResponse | null;
}

export interface ApiClientContactResponse {
  id: string;
  full_name: string;
  phone_number?: string | null;
  email?: string | null;
  is_main: boolean;
  note?: string | null;
}

export interface ApiProjectResponse {
  user_project_id?: string;
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_date: string;
  client?: {
    id: string;
    name: string;
  } | null;
  team_members?: number | any[];
}

export interface ApiProjectUserResponse {
  app_user_id: string;
  name: string;
  surname: string;
  role?: {
    id: string;
    name: string;
  } | null;
  is_user_active?: boolean;
}

export interface ApiProjectDevelopmentResponse {
  id: string;
  name: string;
  description: string;
  technology?: ApiTechnologyResponse | null;
  url_repository: string;
  links?: {
    id: string;
    environment: string;
    url: string;
  }[];
}

export interface ApiProjectRoleResponse {
  id: string;
  name: string;
}

export interface ApiProjectTimeEntryResponse {
  id: string;
  app_user_id: string;
  name: string;
  surname: string;
  date: string;
  hour: number | string;
  comment?: string | null;
}

export interface ApiUserResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: any;
  is_active: boolean;
}

export interface ApiTimeEntryResponse {
  id: string;
  date: string;
  hour: number | string;
  comment?: string | null;
  project?: {
    id: string;
    name: string;
  } | null;
}
