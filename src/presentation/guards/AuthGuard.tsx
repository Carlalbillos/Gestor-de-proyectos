import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};