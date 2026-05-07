import type { UserRepository } from "../../domain/ports/UserRepository";
import type { User, TimeEntriesResponse } from "../../domain/entities/user.entity";
import type { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AdminChangePasswordDTO } from "../dto/user.dto";
import type { Project } from "../../domain/entities/project.entity";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  async getUserProfile(id: string): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async createUser(dto: CreateUserDTO): Promise<void> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<void> {
    return await this.userRepository.updateUser(id, dto);
  }

  async changePassword(id: string, dto: ChangePasswordDTO): Promise<void> {
    return await this.userRepository.changePassword(id, dto);
  }

  async adminChangePassword(id: string, dto: AdminChangePasswordDTO): Promise<void> {
    return await this.userRepository.adminChangePassword(id, dto);
  }

  async getUserProjects(id: string): Promise<Project[]> {
    return await this.userRepository.getUserProjects(id);
  }

  async getUserTimeEntries(id: string): Promise<TimeEntriesResponse> {
    return await this.userRepository.getUserTimeEntries(id);
  }
}
