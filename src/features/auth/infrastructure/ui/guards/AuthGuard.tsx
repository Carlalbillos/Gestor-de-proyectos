// features/auth/infrastructure/ui/guards/AuthGuard.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../stores/auth.store";

export const AuthGuard = () => {
  const user = useAuthStore((state) => state.user);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
