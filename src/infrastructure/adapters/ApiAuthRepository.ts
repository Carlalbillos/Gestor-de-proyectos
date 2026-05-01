import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { api } from "@/infrastructure/adapters/AxiosHttpClient";

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

interface JwtPayload {
  id?: string;
  name?: string;
  surname?: string;
  is_active?: boolean;
  email?: string;
  role?: string;
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

      const decoded = this.decodeToken(token);

      return {
        user: {
          id: decoded.id,
          email: decoded.email ?? credentials.email,
          name: decoded.name ?? "",
          surname: decoded.surname ?? "",
          role: decoded.role,
          is_active: decoded.is_active ?? false,
        },
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new InvalidCredentialsError();
      }

      throw error instanceof Error
        ? error
        : new Error("Error desconocido durante el login");
    }
  }

  private decodeToken(token: string): Required<Pick<JwtPayload, "id" | "role">> & JwtPayload {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.id) {
        throw new Error("El token JWT no contiene el ID del usuario");
      }

      if (!decoded.role) {
        throw new Error("El token JWT no contiene el rol del usuario");
      }

      return decoded as Required<Pick<JwtPayload, "id" | "role">> & JwtPayload;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error decodificando el token: ${error.message}`);
      }

      throw new Error("Error desconocido al decodificar el token");
    }
  }
}