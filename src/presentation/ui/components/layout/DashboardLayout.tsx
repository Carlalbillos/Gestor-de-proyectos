import { Outlet, NavLink, useNavigate } from "react-router";
import { useEffect } from "react";

import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { useDashboardStore } from "@/infrastructure/stores/dashboard.store";
import { Button } from "@/presentation/ui/components/ui/button";
import { isAdmin } from "@/domain/services/role.service";
import { Home, Users, Building2, Briefcase, Settings, LogOut } from "lucide-react";

export const DashboardLayout = () => {
  const { logout, user } = useAuthStore();
  const { profile, fetchDashboardData } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id && !profile) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, profile, fetchDashboardData]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors";

  const activeClasses = "bg-muted text-foreground shadow-sm";
  const inactiveClasses = "text-muted-foreground hover:bg-muted hover:text-foreground";

  const loggedAsAdmin = isAdmin(user);
  const initials = profile ? `${profile.name?.[0] || ""}${profile.surname?.[0] || ""}`.toUpperCase() : "U";
  const roleName = profile ? (isAdmin(profile) ? "Administrador" : "Usuario") : "";

  return (
    <div className="h-screen min-h-screen flex bg-muted/10">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col shadow-sm">
        <div className="p-6 border-b space-y-4">
          <h2 className="text-xl font-bold text-primary tracking-tight">
            <img src="/logo480-t.png" alt="Logo 480:DEV PROJECTS" className="h-8" />
          </h2>

          {/* Perfil del usuario justo debajo del logo */}
          {profile && (
            <div className="flex items-center gap-3 p-1">
              <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xs font-bold text-primary">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-foreground">
                  {profile.name} {profile.surname}
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
                  {roleName}
                </p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1 mt-2">
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

          {loggedAsAdmin && (
            <>
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
            </>
          )}

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

        <div className="p-4 border-t bg-muted/20">
          <div className="space-y-1">
            <NavLink
              to="/configuracion"
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <Settings className="h-4 w-4" />
              Configuración
            </NavLink>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-9"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
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