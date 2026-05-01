export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface CreateUserDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  name?: string;
  surname?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

export interface TimeEntry {
  id: string;
  project_user_id: string;
  date: string;
  hour: number;
  comment: string;
  project: {
    id: string;
    name: string;
  };
}

export interface TimeEntriesResponse {
  total_hours: number;
  data: TimeEntry[];
}
