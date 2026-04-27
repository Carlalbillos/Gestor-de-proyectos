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
  token: string;
}

interface JwtPayload {
  id?: string;
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
      
      let decodedId = "";
      let decodedRole = "";
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.id) {
          throw new Error("El token JWT no contiene el ID del usuario.");
        }
        decodedId = decoded.id;
        decodedRole = decoded.role || "ROLE_USER";
      } catch (e: any) {
        throw new Error("Error decodificando el token: " + e.message);
      }

      return {
        user: { 
          id: decodedId,
          email: credentials.email,
          name: "", 
          surname: "",
          role: decodedRole,
          is_active: true
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
