import { Outlet, Link, useNavigate } from "react-router";
import { useAuthStore } from "@/infrastructure/stores/auth.store";
import { Button } from "@/infrastructure/ui/components/ui/button";
import { LogOut, Home, Users, Briefcase } from "lucide-react";

export const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary tracking-tight">480:PROJECTS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <Home className="w-4 h-4" /> Inicio
          </Link>
          <Link to="/proyectos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
            <Briefcase className="w-4 h-4" /> Proyectos
          </Link>
          <Link to="/personal" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors text-muted-foreground">
            <Users className="w-4 h-4" /> Personal
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
