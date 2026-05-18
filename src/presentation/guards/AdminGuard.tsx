import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";

export const AdminGuard = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
