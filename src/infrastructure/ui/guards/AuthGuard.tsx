import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { useEffect } from "react";

export const AuthGuard = () => {
  const user = useAuthStore((state) => state.user);
  const checkToken = useAuthStore((state) => state.checkToken);

  // 4. Verificación periódica y 5. Middleware de ruta protegida
  useEffect(() => {
    // Verificar token al montar el componente (cambio de ruta)
    checkToken();

    // Verificación periódica cada 5 minutos
    const interval = setInterval(() => {
      checkToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkToken]);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
