import type { User } from "../entities/user.entity";
import type { Project } from "../entities/project.entity";

export interface UserRepository {
  getById(id: string): Promise<User>;
  getUserProjects(id: string): Promise<Project[]>;
}
