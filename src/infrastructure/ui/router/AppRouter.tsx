import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { DashboardLayout } from "@/infrastructure/ui/components/layout/DashboardLayout";

import { LoginPage } from "@/infrastructure/ui/pages/LoginPage";
import { HomePage } from "@/infrastructure/ui/pages/HomePage";
import { ProjectsPage } from "@/infrastructure/ui/pages/ProjectsPage";
import { CreateProjectPage } from "@/infrastructure/ui/pages/CreateProjectPage";
import { ProjectDetailsPage } from "@/infrastructure/ui/pages/ProjectDetailsPage";
import { ClientsPage } from "@/infrastructure/ui/pages/ClientsPage";
import { CreateClientPage } from "@/infrastructure/ui/pages/CreateClientPage";

import { AuthGuard } from "@/infrastructure/ui/guards/AuthGuard";
import { AdminGuard } from "@/infrastructure/ui/guards/AdminGuard";
import { UnauthGuard } from "@/infrastructure/ui/guards/UnauthGuard";


const router = createBrowserRouter([
  {
    element: <UnauthGuard />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
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
            path: "proyectos",
            element: <ProjectsPage />,
          },
          {
            path: "proyectos/:id",
            element: <ProjectDetailsPage />,
          },
          {
            element: <AdminGuard />,
            children: [
              {
                path: "personal",
                element: <div className="p-8 text-center text-muted-foreground">
                  Listado de Personal próximamente...
                </div>,
              },
              {
                path: "clientes",
                element: <ClientsPage />,
              },
              {
                path: "clientes/nuevo",
                element: <CreateClientPage />,
              },
              {
                path: "proyectos/nuevo",
                element: <CreateProjectPage />,
              },
            ],
          },
          {
            path: "*",
            element: <Navigate replace to="/" />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
