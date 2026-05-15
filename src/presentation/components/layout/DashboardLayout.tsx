import { Outlet, NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/presentation/stores/auth.store";
import { useDashboardStore } from "@/presentation/stores/dashboard.store";
import { Button } from "@/presentation/components/ui/button";
import { isAdmin } from "@/domain/services/role.service";
import {
  Home,
  Users,
  Building2,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const DashboardLayout = () => {
  const { logout, user } = useAuthStore();
  const { profile, fetchDashboardData } = useDashboardStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id && !profile) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, profile]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";
  const activeClasses =
    "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20";
  const inactiveClasses =
    "text-muted-foreground hover:bg-muted hover:text-foreground";

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? "justify-center px-0" : ""
    }`;

  const loggedAsAdmin = isAdmin(user);
  const initials = profile
    ? `${profile.name?.[0] ?? ""}${profile.surname?.[0] ?? ""}`.toUpperCase()
    : "U";
  const roleName = profile
    ? isAdmin(profile)
      ? "Administrador"
      : "Usuario"
    : "";

  return (
    <div className="h-screen min-h-screen flex bg-muted/10 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isCollapsed ? "w-20" : "w-64"
          } bg-background border-r flex flex-col shadow-xl transition-all duration-300 ease-in-out relative z-20`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-background border rounded-full p-1 shadow-md hover:bg-muted transition-colors z-30"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Header — Logo + Perfil */}
        <div
          className={`p-6 border-b flex flex-col items-center ${isCollapsed ? "px-2" : "space-y-4"
            }`}
        >
          {/* Logo */}
          <div className="h-8 flex items-center justify-center overflow-hidden">
            {isCollapsed ? (
              <span className="text-primary font-black text-lg leading-none">
                <img
                  src="/logo480-t.png"
                  alt="480:DEV PROJECTS"
                  className="h-3 w-auto"
                />
              </span>
            ) : (
              <img
                src="/logo480-t.png"
                alt="480:DEV PROJECTS"
                className="h-8 w-auto"
                width={174}
                height={32}
              />
            )}
          </div>

          {/* Perfil del usuario */}
          {profile && (
            <div
              className={`flex items-center gap-3 p-1 w-full ${isCollapsed ? "justify-center" : ""
                }`}
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                <span className="text-sm font-bold text-primary">
                  {initials}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 animate-in fade-in duration-500">
                  <p className="text-xs font-bold truncate text-foreground">
                    {profile.name} {profile.surname}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold opacity-70">
                    {roleName}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 p-3 space-y-2 mt-2 overflow-y-auto overflow-x-hidden">
          <NavLink
            to="/"
            end
            className={navLinkClasses}
            title={isCollapsed ? "Inicio" : undefined}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Inicio</span>}
          </NavLink>

          {loggedAsAdmin && (
            <>
              <NavLink
                to="/personal"
                className={navLinkClasses}
                title={isCollapsed ? "Personal" : undefined}
              >
                <Users className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Personal</span>}
              </NavLink>

              <NavLink
                to="/clientes"
                className={navLinkClasses}
                title={isCollapsed ? "Clientes" : undefined}
              >
                <Building2 className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Clientes</span>}
              </NavLink>
            </>
          )}

          <NavLink
            to="/proyectos"
            className={navLinkClasses}
            title={isCollapsed ? "Proyectos" : undefined}
          >
            <Briefcase className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Proyectos</span>}
          </NavLink>
        </nav>

        {/* Navegación inferior */}
        <div className="p-4 border-t bg-muted/20 space-y-2">
          <NavLink
            to="/configuracion"
            className={navLinkClasses}
            title={isCollapsed ? "Configuración" : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Configuración</span>}
          </NavLink>

          <Button
            variant="ghost"
            size="sm"
            className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10 ${isCollapsed ? "justify-center p-0" : "justify-start px-3"
              }`}
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            aria-label="Cerrar Sesión"
          >
            <LogOut
              className={`h-5 w-5 shrink-0 ${isCollapsed ? "" : "mr-3"}`}
            />
            {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};