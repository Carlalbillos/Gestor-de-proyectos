import axios from "axios";

export interface HttpAuthHandler {
  getRefreshToken(): string | null;
  refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }>;
  onRefreshSuccess(accessToken: string, refreshToken?: string): void;
  onRefreshFailure(error: any): void;
}

let accessToken: string | null = null;
let authHandler: HttpAuthHandler | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const setHttpAuthHandler = (handler: HttpAuthHandler): void => {
  authHandler = handler;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
        if (!authHandler) {
          throw new Error("No auth handler registered for token refresh");
        }

        const refreshToken = authHandler.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { accessToken: newToken, refreshToken: newRefreshToken } = await authHandler.refresh(refreshToken);

        authHandler.onRefreshSuccess(newToken, newRefreshToken);
        onTokenRefreshed(newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError: any) {
        isRefreshing = false;
        refreshSubscribers = [];

        if (authHandler) {
          authHandler.onRefreshFailure(refreshError);
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.response?.data?.detail) {
      error.message = error.response.data.detail;
    }
    error.status = error.response?.status;

    return Promise.reject(error);
  }
);
