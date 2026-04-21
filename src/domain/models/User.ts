export type SystemRole = "ADMIN" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  firstTime: boolean;
  isActive: boolean;
  role: SystemRole;
}
