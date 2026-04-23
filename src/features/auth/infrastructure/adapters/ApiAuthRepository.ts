import { AxiosError } from "axios";
import { api } from "../../../../shared/infrastructure/adapters/AxiosHttpClient";
import type {
  AuthRepository,
  AuthCredentials,
  AuthResponse,
} from "../../domain/ports/AuthRepository";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialsError";

interface LoginApiResponse {
  token: string;
}

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginApiResponse>("/login", {
        email: credentials.email,
        password: credentials.password,
      });

      return {
        user: { email: credentials.email },
        accessToken: response.data.token,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new InvalidCredentialsError();
      }
      throw error;
    }
  }
}
