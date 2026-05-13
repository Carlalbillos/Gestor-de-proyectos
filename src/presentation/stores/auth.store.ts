import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import type { User } from "@/domain/entities/user.entity";
import { setAccessToken } from "@/infrastructure/http/AxiosHttpClient";
import type { ChangePasswordDTO } from "@/application/dto/user/ChangePassword.dto";
import { container } from "@/infrastructure/di/container";

const { loginUseCase, logoutUseCase, changePasswordUseCase } = container;

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
  changePassword: (dto: ChangePasswordDTO) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await loginUseCase.execute(email, password);
          setAccessToken(result.accessToken);
          set({
            user: result.user,
            token: result.accessToken,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await logoutUseCase.execute(refreshToken);
          } catch (error) {
            console.error("Formal logout failed", error);
          }
        }
        setAccessToken(null);
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateTokens: (token, refreshToken) => {
        setAccessToken(token);
        set({ token, refreshToken, isAuthenticated: true });
      },

      changePassword: async (dto) => {
        const { user } = get();
        if (!user) throw new Error("No autenticado");

        set({ isLoading: true });
        try {
          await changePasswordUseCase.execute(user.id, dto);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.token) return;

        try {
          const { exp } = jwtDecode<{ exp?: number }>(state.token);
          if (exp && exp * 1000 < Date.now()) {
            state.logout();
          } else {
            setAccessToken(state.token);
            state.isAuthenticated = true;
          }
        } catch {
          state.logout();
        }
      },
    }
  )
);