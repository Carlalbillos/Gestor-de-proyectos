import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/",
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

// 2. Interceptor 401: Limpiar sesión automáticamente en errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Importamos de manera dinámica para evitar dependencias circulares
      const { useAuthStore } = await import("@/infrastructure/stores/auth.store");
      useAuthStore.getState().logout();
      
      // Redirigir a login si no estamos ya allí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
