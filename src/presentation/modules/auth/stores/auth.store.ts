import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import type { User } from "@/domain/entities/user.entity";
import type { ChangePasswordDTO } from "@/application/dto/user/ChangePassword.dto";
import { setAccessToken } from "@/infrastructure/http/AxiosHttpClient";
import { container } from "@/infrastructure/di/container";

const {
  loginUseCase,
  logoutUseCase,
  changePasswordUseCase,
  refreshTokenUseCase,
} = container;

type JwtPayload = { exp?: number };

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  setSession: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearSession: () => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTokens: (token: string, refreshToken: string) => void;
  refreshSession: () => Promise<void>;
  initializeAuth: () => Promise<void>;
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
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setSession: ({ user, accessToken, refreshToken }) => {
        setAccessToken(accessToken);
        set({
          user,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearSession: () => {
        setAccessToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await loginUseCase.execute(email, password);
          get().setSession({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { refreshToken } = get();

        try {
          if (refreshToken) {
            await logoutUseCase.execute(refreshToken);
          }
        } catch (error) {
          console.error("Formal logout failed", error);
        } finally {
          get().clearSession();
          useAuthStore.persist.clearStorage();
        }
      },

      updateTokens: (token, refreshToken) => {
        setAccessToken(token);
        set({
          token,
          refreshToken,
          isAuthenticated: true,
        });
      },

      refreshSession: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const result = await refreshTokenUseCase.execute(refreshToken);

        setAccessToken(result.accessToken);
        set({
          token: result.accessToken,
          refreshToken: result.refreshToken ?? refreshToken,
          isAuthenticated: true,
        });
      },

      initializeAuth: async () => {
        const { token, refreshToken, user } = get();

        if (!token || !user) {
          get().clearSession();
          return;
        }

        if (!isTokenExpired(token)) {
          setAccessToken(token);
          set({ isAuthenticated: true });
          return;
        }

        if (!refreshToken) {
          await get().logout();
          return;
        }

        try {
          await get().refreshSession();
        } catch {
          await get().logout();
        }
      },

      changePassword: async (dto) => {
        const { user } = get();
        if (!user) throw new Error("No autenticado");

        set({ isLoading: true });
        try {
          await changePasswordUseCase.execute(user.id, dto);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.clearSession();
        }
        state?.setHasHydrated(true);
      },
    }
  )
);