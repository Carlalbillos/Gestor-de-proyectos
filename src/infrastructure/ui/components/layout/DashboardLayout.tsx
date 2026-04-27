import { Outlet, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { Home, Users, Building2, Briefcase } from "lucide-react";

export const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";

  const activeClasses = "bg-muted text-foreground";
  const inactiveClasses = "text-muted-foreground hover:bg-muted";

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary tracking-tight">
            480:PROJECTS
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Home className="h-4 w-4" />
            Inicio
          </NavLink>

          <NavLink
            to="/personal"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Users className="h-4 w-4" />
            Personal
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Building2 className="h-4 w-4" />
            Clientes
          </NavLink>

          <NavLink
            to="/proyectos"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Briefcase className="h-4 w-4" />
            Proyectos
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};