import { create } from "zustand";
import { setAccessToken } from "@/infrastructure/adapters/AxiosHttpClient";
import { LoginUseCase } from "@/application/services/LoginUseCase";
import { ApiAuthRepository } from "@/infrastructure/adapters/ApiAuthRepository";
import type { User } from "@/domain/entities/user.entity";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkToken: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const result = await loginUseCase.execute(email, password);

          setAccessToken(result.accessToken);
          set({
            user: result.user,
            token: result.accessToken,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        setAccessToken(null);
        set({
          user: null,
          token: null,
        });
      },

      checkToken: () => {
        const { token, logout } = get();
        if (!token) return false;

        try {
          const decoded = jwtDecode(token);
          // Si el token ha expirado, cerramos la sesión
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
            return false;
          }
          return true;
        } catch {
          logout();
          return false;
        }
      }
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          try {
            const decoded = jwtDecode(state.token);
            // 1. Validación en rehidratación: Verificar expiración al cargar
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              state.token = null;
              state.user = null;
              setAccessToken(null);
            } else {
              setAccessToken(state.token);
            }
          } catch {
            state.token = null;
            state.user = null;
            setAccessToken(null);
          }
        }
      },
    }
  )
);
