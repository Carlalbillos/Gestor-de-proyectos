import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import type { User } from "@/domain/entities/user.entity";
import { setAccessToken } from "@/infrastructure/adapters/AxiosHttpClient";
import { ApiAuthRepository } from "@/infrastructure/adapters/ApiAuthRepository";
import { LoginUseCase } from "@/application/services/LoginUseCase";

const loginUseCase = new LoginUseCase(new ApiAuthRepository());

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
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
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        setAccessToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
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