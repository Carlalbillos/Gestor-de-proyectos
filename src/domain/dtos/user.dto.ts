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

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AdminChangePasswordDTO {
  newPassword: string;
}

export interface CreateTimeEntryDTO {
  id: string;
  project_id: string;
  date: string;
  hour: number;
  comment: string;
}

export interface UserQueryParams {
  isActive?: boolean;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}
