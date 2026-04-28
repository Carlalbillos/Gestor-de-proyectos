import { AxiosError } from "axios";
import { api } from "@/infrastructure/adapters/AxiosHttpClient";
import type {
  AuthRepository,
  AuthCredentials,
  AuthResponse,
} from "@/domain/ports/AuthRepository";
import { InvalidCredentialsError } from "@/domain/exceptions/InvalidCredentialsError";

import { jwtDecode } from "jwt-decode";

interface LoginApiResponse {
  access_token?: string;
  token?: string;
  accessToken?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: string;
}

interface JwtPayload {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginApiResponse>("login", {
        email: credentials.email,
        password: credentials.password,
      });

      const token = response.data.access_token ?? response.data.token ?? response.data.accessToken ?? response.data;
      if (!token || typeof token !== "string") {
        throw new Error("La respuesta de autenticación no contiene un token válido");
      }

      let decodedId = "";
      let decodedRole = "ROLE_EMPLOYEE";
      let decodedEmail = credentials.email;
      let decodedName = "";
      let decodedSurname = "";

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        decodedId = decoded.id || decoded.sub || "";
        decodedRole = decoded.role || "ROLE_EMPLOYEE";
        decodedEmail = decoded.email || credentials.email;
        decodedName = decoded.name || decoded.given_name || "";
        decodedSurname = decoded.family_name || "";

        if (!decodedId) {
          throw new Error("El token JWT no contiene el ID del usuario.");
        }
      } catch (e: any) {
        throw new Error("Error decodificando el token: " + e.message);
      }

      return {
        user: {
          id: decodedId,
          email: decodedEmail,
          name: decodedName,
          surname: decodedSurname,
          role: decodedRole,
          is_active: true,
        },
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new InvalidCredentialsError();
      }
      throw error;
    }
  }
}
