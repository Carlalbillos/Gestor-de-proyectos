import type { UserRepository, UserQueryParams, PaginatedResult } from "../../domain/ports/UserRepository";
import type { User, TimeEntriesResponse } from "../../domain/entities/user.entity";
import type { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AdminChangePasswordDTO, CreateTimeEntryDTO } from "../dto/user.dto";
import type { Project } from "../../domain/entities/project.entity";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(params?: UserQueryParams): Promise<PaginatedResult<User>> {
    return await this.userRepository.getUsers(params);
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

  async createTimeEntry(id: string, dto: CreateTimeEntryDTO): Promise<void> {
    return await this.userRepository.createTimeEntry(id, dto);
  }

  async changeActivityUser(id: string): Promise<void> {
    return await this.userRepository.changeActivityUser(id);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }
}
