import axios, { AxiosError } from "axios";
import { api } from "@/infrastructure/http/AxiosHttpClient";
import { AuthMapper } from "../mappers/AuthMapper";

import type {
  AuthRepository,
} from "@/domain/ports/AuthRepository";
import type { LoginRequestDTO } from "@/application/dto/auth/LoginRequest.dto";
import type { LoginResponseDTO } from "@/application/dto/auth/LoginResponse.dto";

import { InvalidCredentialsError } from "@/domain/exceptions/InvalidCredentialsError";

interface LoginApiResponse {
  token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: string;
}

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginApiResponse>("login", {
        email: credentials.email,
        password: credentials.password,
      });

      const token = response.data.token;
      const refreshToken = response.data.refresh_token;

      if (typeof token !== "string" || !token.trim() || !refreshToken) {
        throw new Error("La respuesta de autenticación no contiene tokens válidos");
      }

      return AuthMapper.toAuthResponse(token, credentials.email, refreshToken);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new InvalidCredentialsError();
      }

      throw error instanceof Error
        ? error
        : new Error("Error desconocido durante el login");
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await api.post("logout", { refresh_token: refreshToken });
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Usamos axios directamente para evitar interceptores y posibles bucles infinitos
    const baseURL = import.meta.env.VITE_API_URL;
    const response = await axios.post(`${baseURL}refresh`, { refresh_token: token }, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data.token) {
      throw new Error("No se recibió un nuevo token");
    }

    return {
      accessToken: response.data.token,
      refreshToken: response.data.refresh_token || token,
    };
  }
}