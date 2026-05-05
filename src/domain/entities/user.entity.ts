export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  isActive: boolean;
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
  isActive?: boolean;
}

export interface TimeEntry {
  id: string;
  projectUserId: string;
  date: string;
  hour: number;
  comment: string;
  project: {
    id: string;
    name: string;
  };
}

export interface TimeEntriesResponse {
  totalHours: number;
  data: TimeEntry[];
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordDTO {
  newPassword: string;
}
