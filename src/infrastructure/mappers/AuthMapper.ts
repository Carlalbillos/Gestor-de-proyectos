import { jwtDecode } from "jwt-decode";
import type { AuthResponse } from "../../domain/ports/AuthRepository";
import { Email } from "../../domain/value-objects/Email";

interface JwtPayload {
  id?: string;
  name?: string;
  surname?: string;
  is_active?: boolean;
  email?: string;
  username?: string;
  role?: string;
}

export class AuthMapper {
  static toAuthResponse(token: string, emailFallback: string, refreshToken: string): AuthResponse {
    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error decodificando el token: ${error.message}`);
      }
      throw new Error("Error desconocido al decodificar el token");
    }

    if (!decoded.id) {
      throw new Error("El token JWT no contiene el ID del usuario");
    }

    if (!decoded.role) {
      throw new Error("El token JWT no contiene el rol del usuario");
    }

    // Resolvemos el email de forma agnóstica a ambos backends
    const resolvedEmail = decoded.email ?? decoded.username ?? emailFallback;

    return {
      user: {
        id: decoded.id,
        email: new Email(resolvedEmail),
        name: decoded.name ?? "",
        surname: decoded.surname ?? "",
        role: decoded.role,
        isActive: decoded.is_active ?? true, // Si se ha logueado con éxito, asumimos true por defecto
      },
      accessToken: token,
      refreshToken,
    };
  }
}
