import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "@/infrastructure/ui/pages/LoginPage";
import { AuthGuard } from "@/infrastructure/ui/guards/AuthGuard";
import { AdminGuard } from "@/infrastructure/ui/guards/AdminGuard";
import { DashboardLayout } from "@/infrastructure/ui/components/layout/DashboardLayout";
import { HomePage } from "@/infrastructure/ui/pages/HomePage";
import { ProjectsPage } from "@/infrastructure/ui/pages/ProjectsPage";
import { CreateProjectPage } from "@/infrastructure/ui/pages/CreateProjectPage";
import { ProjectDetailsPage } from "@/infrastructure/ui/pages/ProjectDetailsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/personal",
            element: <div className="p-8 text-center text-muted-foreground">Listado de Personal próximamente...</div>,
          },
          {
            path: "/clientes",
            element: <div className="p-8 text-center text-muted-foreground">Listado de Clientes próximamente...</div>,
          },
          {
            path: "/proyectos",
            element: <ProjectsPage />,
          },
          {
            path: "/proyectos/:id",
            element: <ProjectDetailsPage />,
          },
        ]
      },
      {
        element: <AdminGuard />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/proyectos/nuevo",
                element: <CreateProjectPage />,
              },
            ]
          },
        ]
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
