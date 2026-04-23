import { create } from "zustand";
import { api, setAccessToken } from "../../../../shared/infrastructure/adapters/AxiosHttpClient";

interface User {
  email: string;
}

interface LoginResponse {
  access_token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });

      setAccessToken(response.data.access_token);
      set({
        user: { email },
        token: response.data.access_token,
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
}));
