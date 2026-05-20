import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { useDashboardStore } from "@/presentation/modules/dashboard/stores/dashboard.store";
import { isAdmin } from "@/domain/services/role.service";
import {
  Home,
  Users,
  Building2,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
  TooltipProvider,
} from "@/presentation/ui";

const AppSidebar = () => {
  const { logout, user } = useAuthStore();
  const { profile } = useDashboardStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const loggedAsAdmin = isAdmin(user);
  const initials = profile
    ? `${profile.name?.[0] ?? ""}${profile.surname?.[0] ?? ""}`.toUpperCase()
    : "U";
  const roleName = profile
    ? isAdmin(profile)
      ? "Administrador"
      : "Usuario"
    : "";

  const isCollapsed = state === "collapsed";

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r shadow-xl">
      {/* Header — Logo + Perfil */}
      <SidebarHeader className={`p-6 border-b flex flex-col items-center ${isCollapsed ? "px-2" : "space-y-4"}`}>
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
          <div className={`flex items-center gap-3 p-1 w-full ${isCollapsed ? "justify-center" : ""}`}>
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
      </SidebarHeader>

      {/* Navegación principal */}
      <SidebarContent className="p-3">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isLinkActive("/")}
              tooltip="Inicio"
              className="h-9"
            >
              <NavLink to="/">
                <Home className="h-5 w-5 shrink-0" />
                <span>Inicio</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {loggedAsAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive("/personal")}
                  tooltip="Personal"
                  className="h-9"
                >
                  <NavLink to="/personal">
                    <Users className="h-5 w-5 shrink-0" />
                    <span>Personal</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive("/clientes")}
                  tooltip="Clientes"
                  className="h-9"
                >
                  <NavLink to="/clientes">
                    <Building2 className="h-5 w-5 shrink-0" />
                    <span>Clientes</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isLinkActive("/proyectos")}
              tooltip="Proyectos"
              className="h-9"
            >
              <NavLink to="/proyectos">
                <Briefcase className="h-5 w-5 shrink-0" />
                <span>Proyectos</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Navegación inferior */}
      <SidebarFooter className="p-4 border-t bg-muted/20">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isLinkActive("/configuracion")}
              tooltip="Configuración"
              className="h-9"
            >
              <NavLink to="/configuracion">
                <Settings className="h-5 w-5 shrink-0" />
                <span>Configuración</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Cerrar Sesión"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-9"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const DashboardLayout = () => {
  const { user } = useAuthStore();
  const { profile, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    if (user?.id && !profile) {
      fetchDashboardData(user.id);
    }
  }, [user?.id, profile]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="h-screen min-h-screen flex w-full bg-muted/10 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-muted/10">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};