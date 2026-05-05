import { AxiosError } from "axios";
import { api } from "@/infrastructure/adapters/AxiosHttpClient";
import { AuthMapper } from "../mappers/AuthMapper";

import type {
  AuthRepository,
  AuthCredentials,
  AuthResponse,
} from "@/domain/ports/AuthRepository";

import { InvalidCredentialsError } from "@/domain/exceptions/InvalidCredentialsError";

interface LoginApiResponse {
  token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: string;
}

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginApiResponse>("login", {
        email: credentials.email,
        password: credentials.password,
      });

      const token = response.data.token;

      if (typeof token !== "string" || !token.trim()) {
        throw new Error("La respuesta de autenticación no contiene un token válido");
      }

      return AuthMapper.toAuthResponse(token, credentials.email);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new InvalidCredentialsError();
      }

      throw error instanceof Error
        ? error
        : new Error("Error desconocido durante el login");
    }
  }
}