import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401, no hemos reintentado ya, Y NO es una petición de login
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("login")) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { useAuthStore } = await import("@/infrastructure/stores/auth.store");
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        // Llamada directa con axios para evitar interceptores y bucles
        const response = await axios.post("/api/token/refresh", { refresh_token: refreshToken });

        const newToken = response.data.token;
        const newRefreshToken = response.data.refresh_token;

        if (!newToken) {
          throw new Error("No new token received");
        }

        useAuthStore.getState().updateTokens(newToken, newRefreshToken || refreshToken);
        onTokenRefreshed(newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError: any) {
        isRefreshing = false;
        refreshSubscribers = [];

        const { useAuthStore } = await import("@/infrastructure/stores/auth.store");
        useAuthStore.getState().logout();

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    error.status = error.response?.status;

    return Promise.reject(error);
  }
);
