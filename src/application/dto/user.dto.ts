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
