import { ApiAuthRepository } from "../adapters/ApiAuthRepository";
import { ApiClientRepository } from "../adapters/ApiClientRepository";
import { ApiProjectRepository } from "../adapters/ApiProjectRepository";
import { ApiSectorRepository } from "../adapters/ApiSectorRepository";
import { ApiTechnologyRepository } from "../adapters/ApiTechnologyRepository";
import { ApiUserRepository } from "../adapters/ApiUserRepository";

// Auth
import { LoginUseCase } from "@/application/use-cases/auth/LoginUseCase";
import { LogoutUseCase } from "@/application/use-cases/auth/LogoutUseCase";
import { RefreshTokenUseCase } from "@/application/use-cases/auth/RefreshTokenUseCase";

// Client
import { CreateClientUseCase } from "@/application/use-cases/client/CreateClientUseCase";
import { ChangeClientStatusUseCase } from "@/application/use-cases/client/ChangeClientStatusUseCase";
import { GetClientByIdUseCase } from "@/application/use-cases/client/GetClientByIdUseCase";
import { DeleteClientUseCase } from "@/application/use-cases/client/DeleteClientUseCase";
import { GetClientProjectsUseCase } from "@/application/use-cases/client/GetClientProjectsUseCase";
import { UpdateClientUseCase } from "@/application/use-cases/client/UpdateClientUseCase";
import { DeleteContactUseCase } from "@/application/use-cases/client/DeleteContactUseCase";
import { GetClientContactsUseCase } from "@/application/use-cases/client/GetClientContactsUseCase";
import { UpdateContactUseCase } from "@/application/use-cases/client/UpdateContactUseCase";
import { CreateContactUseCase } from "@/application/use-cases/client/CreateContactUseCase";
import { GetClientsUseCase } from "@/application/use-cases/client/GetClientsUseCase";
import { SetMainContactUseCase } from "@/application/use-cases/client/SetMainContactUseCase";

// Project
import { AssignUserUseCase } from "@/application/use-cases/project/AssignUserUseCase";
import { ChangeProjectStatusUseCase } from "@/application/use-cases/project/ChangeProjectStatusUseCase";
import { CreateDevelopmentUseCase } from "@/application/use-cases/project/CreateDevelopmentUseCase";
import { CreateProjectUseCase } from "@/application/use-cases/project/CreateProjectUseCase";
import { DeleteDevelopmentUseCase } from "@/application/use-cases/project/DeleteDevelopmentUseCase";
import { DeleteProjectTimeEntryUseCase } from "@/application/use-cases/project/DeleteProjectTimeEntryUseCase";
import { DeleteProjectUseCase } from "@/application/use-cases/project/DeleteProjectUseCase";
import { GetProjectByIdUseCase } from "@/application/use-cases/project/GetProjectByIdUseCase";
import { GetProjectDevelopmentsUseCase } from "@/application/use-cases/project/GetProjectDevelopmentsUseCase";
import { GetProjectRolesUseCase } from "@/application/use-cases/project/GetProjectRolesUseCase";
import { GetProjectTimeEntriesUseCase } from "@/application/use-cases/project/GetProjectTimeEntriesUseCase";
import { GetProjectUsersUseCase } from "@/application/use-cases/project/GetProjectUsersUseCase";
import { GetProjectsUseCase } from "@/application/use-cases/project/GetProjectsUseCase";
import { ChangeUserStatusUseCase } from "@/application/use-cases/project/ChangeUserStatusUseCase";
import { UpdateDevelopmentUseCase } from "@/application/use-cases/project/UpdateDevelopmentUseCase";
import { UpdateProjectTimeEntryUseCase } from "@/application/use-cases/project/UpdateProjectTimeEntryUseCase";
import { UpdateProjectUseCase } from "@/application/use-cases/project/UpdateProjectUseCase";
import { UpdateProjectUsersUseCase } from "@/application/use-cases/project/UpdateProjectUsersUseCase";

// Sector
import { CreateSectorUseCase } from "@/application/use-cases/sector/CreateSectorUseCase";
import { DeleteSectorUseCase } from "@/application/use-cases/sector/DeleteSectorUseCase";
import { GetSectorsUseCase } from "@/application/use-cases/sector/GetSectorsUseCase";
import { UpdateSectorUseCase } from "@/application/use-cases/sector/UpdateSectorUseCase";

// Technology
import { GetTechnologiesUseCase } from "@/application/use-cases/technology/GetTechnologiesUseCase";

// User
import { AdminChangePasswordUseCase } from "@/application/use-cases/user/AdminChangePasswordUseCase";
import { ChangeActivityUserUseCase } from "@/application/use-cases/user/ChangeActivityUserUseCase";
import { ChangePasswordUseCase } from "@/application/use-cases/user/ChangePasswordUseCase";
import { CreateTimeEntryUseCase } from "@/application/use-cases/user/CreateTimeEntryUseCase";
import { CreateUserUseCase } from "@/application/use-cases/user/CreateUserUseCase";
import { DeleteUserUseCase } from "@/application/use-cases/user/DeleteUserUseCase";
import { GetUserByIdUseCase } from "@/application/use-cases/user/GetUserByIdUseCase";
import { GetUserProjectsUseCase } from "@/application/use-cases/user/GetUserProjectsUseCase";
import { GetUserTimeEntriesUseCase } from "@/application/use-cases/user/GetUserTimeEntriesUseCase";
import { GetUsersUseCase } from "@/application/use-cases/user/GetUsersUseCase";
import { UpdateUserUseCase } from "@/application/use-cases/user/UpdateUserUseCase";

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
