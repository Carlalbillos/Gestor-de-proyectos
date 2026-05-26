import { ApiAuthRepository } from "../adapters/ApiAuthRepository";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { ApiSectorRepository } from "../adapters/ApiSectorRepository";
import { ApiTechnologyRepository } from "../adapters/ApiTechnologyRepository";
import { ApiUserRepository } from "../adapters/ApiUserRepository";

// Auth
import { LoginUseCase } from "@/application/auth/LoginUseCase";
import { LogoutUseCase } from "@/application/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@/application/auth/RefreshTokenUseCase";

// Client
import { CreateClientUseCase } from "@/application/client/CreateClientUseCase";
import { ChangeClientStatusUseCase } from "@/application/client/ChangeClientStatusUseCase";
import { GetClientByIdUseCase } from "@/application/client/GetClientByIdUseCase";
import { DeleteClientUseCase } from "@/application/client/DeleteClientUseCase";
import { GetClientProjectsUseCase } from "@/application/client/GetClientProjectsUseCase";
import { UpdateClientUseCase } from "@/application/client/UpdateClientUseCase";
import { DeleteContactUseCase } from "@/application/client/DeleteContactUseCase";
import { GetClientContactsUseCase } from "@/application/client/GetClientContactsUseCase";
import { UpdateContactUseCase } from "@/application/client/UpdateContactUseCase";
import { CreateContactUseCase } from "@/application/client/CreateContactUseCase";
import { GetClientsUseCase } from "@/application/client/GetClientsUseCase";
import { SetMainContactUseCase } from "@/application/client/SetMainContactUseCase";

// Project
import { AssignUserUseCase } from "@/application/project/AssignUserUseCase";
import { ChangeProjectStatusUseCase } from "@/application/project/ChangeProjectStatusUseCase";
import { CreateDevelopmentUseCase } from "@/application/project/CreateDevelopmentUseCase";
import { CreateProjectUseCase } from "@/application/project/CreateProjectUseCase";
import { DeleteDevelopmentUseCase } from "@/application/project/DeleteDevelopmentUseCase";
import { DeleteProjectTimeEntryUseCase } from "@/application/project/DeleteProjectTimeEntryUseCase";
import { DeleteProjectUseCase } from "@/application/project/DeleteProjectUseCase";
import { GetProjectByIdUseCase } from "@/application/project/GetProjectByIdUseCase";
import { GetProjectDevelopmentsUseCase } from "@/application/project/GetProjectDevelopmentsUseCase";
import { GetProjectRolesUseCase } from "@/application/project/GetProjectRolesUseCase";
import { GetProjectTimeEntriesUseCase } from "@/application/project/GetProjectTimeEntriesUseCase";
import { GetProjectUsersUseCase } from "@/application/project/GetProjectUsersUseCase";
import { GetProjectsUseCase } from "@/application/project/GetProjectsUseCase";
import { ChangeUserStatusUseCase } from "@/application/project/ChangeUserStatusUseCase";
import { UpdateDevelopmentUseCase } from "@/application/project/UpdateDevelopmentUseCase";
import { UpdateProjectTimeEntryUseCase } from "@/application/project/UpdateProjectTimeEntryUseCase";
import { UpdateProjectUseCase } from "@/application/project/UpdateProjectUseCase";
import { UpdateProjectUsersUseCase } from "@/application/project/UpdateProjectUsersUseCase";

// Sector
import { CreateSectorUseCase } from "@/application/sector/CreateSectorUseCase";
import { DeleteSectorUseCase } from "@/application/sector/DeleteSectorUseCase";
import { GetSectorsUseCase } from "@/application/sector/GetSectorsUseCase";
import { UpdateSectorUseCase } from "@/application/sector/UpdateSectorUseCase";

// Technology
import { GetTechnologiesUseCase } from "@/application/technology/GetTechnologiesUseCase";
import { CreateTechnologyUseCase } from "@/application/technology/CreateTechnologyUseCase";
import { UpdateTechnologyUseCase } from "@/application/technology/UpdateTechnologyUseCase";
import { DeleteTechnologyUseCase } from "@/application/technology/DeleteTechnologyUseCase";

// User
import { AdminChangePasswordUseCase } from "@/application/user/AdminChangePasswordUseCase";
import { ChangeActivityUserUseCase } from "@/application/user/ChangeActivityUserUseCase";
import { ChangePasswordUseCase } from "@/application/user/ChangePasswordUseCase";
import { CreateTimeEntryUseCase } from "@/application/user/CreateTimeEntryUseCase";
import { CreateUserUseCase } from "@/application/user/CreateUserUseCase";
import { DeleteUserUseCase } from "@/application/user/DeleteUserUseCase";
import { GetUserByIdUseCase } from "@/application/user/GetUserByIdUseCase";
import { GetUserProjectsUseCase } from "@/application/user/GetUserProjectsUseCase";
import { GetUserTimeEntriesUseCase } from "@/application/user/GetUserTimeEntriesUseCase";
import { GetUsersUseCase } from "@/application/user/GetUsersUseCase";
import { UpdateUserUseCase } from "@/application/user/UpdateUserUseCase";

// Instancias de Repositorios
const authRepository = new ApiAuthRepository();
const clientRepository = new ApiClientRepository();
const projectRepository = new ApiProjectRepository();
const sectorRepository = new ApiSectorRepository();
const technologyRepository = new ApiTechnologyRepository();
const userRepository = new ApiUserRepository();

/**
 * Contenedor de Inyección de Dependencias
 * Centraliza la instanciación de repositorios y casos de uso
 */
export const container = {
  // Auth
  loginUseCase: new LoginUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),
  refreshTokenUseCase: new RefreshTokenUseCase(authRepository),

  // Client
  createClientUseCase: new CreateClientUseCase(clientRepository),
  changeClientStatusUseCase: new ChangeClientStatusUseCase(clientRepository),
  getClientByIdUseCase: new GetClientByIdUseCase(clientRepository),
  deleteClientUseCase: new DeleteClientUseCase(clientRepository),
  getClientProjectsUseCase: new GetClientProjectsUseCase(clientRepository),
  updateClientUseCase: new UpdateClientUseCase(clientRepository),
  deleteContactUseCase: new DeleteContactUseCase(clientRepository),
  getClientContactsUseCase: new GetClientContactsUseCase(clientRepository),
  updateContactUseCase: new UpdateContactUseCase(clientRepository),
  createContactUseCase: new CreateContactUseCase(clientRepository),
  getClientsUseCase: new GetClientsUseCase(clientRepository),
  setMainContactUseCase: new SetMainContactUseCase(clientRepository),

  // Project
  assignUserUseCase: new AssignUserUseCase(projectRepository),
  changeProjectStatusUseCase: new ChangeProjectStatusUseCase(projectRepository),
  createDevelopmentUseCase: new CreateDevelopmentUseCase(projectRepository),
  createProjectUseCase: new CreateProjectUseCase(projectRepository),
  deleteDevelopmentUseCase: new DeleteDevelopmentUseCase(projectRepository),
  deleteProjectTimeEntryUseCase: new DeleteProjectTimeEntryUseCase(projectRepository),
  deleteProjectUseCase: new DeleteProjectUseCase(projectRepository),
  getProjectByIdUseCase: new GetProjectByIdUseCase(projectRepository),
  getProjectDevelopmentsUseCase: new GetProjectDevelopmentsUseCase(projectRepository),
  getProjectRolesUseCase: new GetProjectRolesUseCase(projectRepository),
  getProjectTimeEntriesUseCase: new GetProjectTimeEntriesUseCase(projectRepository),
  getProjectUsersUseCase: new GetProjectUsersUseCase(projectRepository),
  getProjectsUseCase: new GetProjectsUseCase(projectRepository),
  changeUserStatusUseCase: new ChangeUserStatusUseCase(projectRepository),
  updateDevelopmentUseCase: new UpdateDevelopmentUseCase(projectRepository),
  updateProjectTimeEntryUseCase: new UpdateProjectTimeEntryUseCase(projectRepository),
  updateProjectUseCase: new UpdateProjectUseCase(projectRepository),
  updateProjectUsersUseCase: new UpdateProjectUsersUseCase(projectRepository),

  // Sector
  createSectorUseCase: new CreateSectorUseCase(sectorRepository),
  deleteSectorUseCase: new DeleteSectorUseCase(sectorRepository),
  getSectorsUseCase: new GetSectorsUseCase(sectorRepository),
  updateSectorUseCase: new UpdateSectorUseCase(sectorRepository),

  // Technology
  getTechnologiesUseCase: new GetTechnologiesUseCase(technologyRepository),
  createTechnologyUseCase: new CreateTechnologyUseCase(technologyRepository),
  updateTechnologyUseCase: new UpdateTechnologyUseCase(technologyRepository),
  deleteTechnologyUseCase: new DeleteTechnologyUseCase(technologyRepository),

  // User
  adminChangePasswordUseCase: new AdminChangePasswordUseCase(userRepository),
  changeActivityUserUseCase: new ChangeActivityUserUseCase(userRepository),
  changePasswordUseCase: new ChangePasswordUseCase(userRepository),
  createTimeEntryUseCase: new CreateTimeEntryUseCase(userRepository),
  createUserUseCase: new CreateUserUseCase(userRepository),
  deleteUserUseCase: new DeleteUserUseCase(userRepository),
  getUserByIdUseCase: new GetUserByIdUseCase(userRepository),
  getUserProjectsUseCase: new GetUserProjectsUseCase(userRepository),
  getUserTimeEntriesUseCase: new GetUserTimeEntriesUseCase(userRepository),
  getUsersUseCase: new GetUsersUseCase(userRepository),
  updateUserUseCase: new UpdateUserUseCase(userRepository),
};
