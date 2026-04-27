import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const AdminGuard = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ROLE_ADMIN" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
