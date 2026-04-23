import { create } from "zustand";
import { setAccessToken } from "../../../../shared/infrastructure/adapters/AxiosHttpClient";
import { LoginUseCase } from "../../application/LoginUseCase";
import { ApiAuthRepository } from "../adapters/ApiAuthRepository";
import type { User } from "../../domain/entities/User";

const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAccessToken(state.token);
        }
      },
    }
  )
);
