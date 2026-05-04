import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { DashboardLayout } from "@/infrastructure/ui/components/layout/DashboardLayout";

import { LoginPage } from "@/infrastructure/ui/pages/LoginPage";
import { HomePage } from "@/infrastructure/ui/pages/HomePage";
import { ProjectsPage } from "@/infrastructure/ui/pages/ProjectsPage";
import { CreateProjectPage } from "@/infrastructure/ui/pages/CreateProjectPage";
import { ProjectDetailsPage } from "@/infrastructure/ui/pages/ProjectDetailsPage";
import { ClientsPage } from "@/infrastructure/ui/pages/ClientsPage";
import { CreateClientPage } from "@/infrastructure/ui/pages/CreateClientPage";
import { ClientsDetailsPage } from "@/infrastructure/ui/pages/ClientsDetailsPage";
import { CreateSectorPage } from "@/infrastructure/ui/pages/CreateSectorPage";

import { AuthGuard } from "@/infrastructure/ui/guards/AuthGuard";
import { AdminGuard } from "@/infrastructure/ui/guards/AdminGuard";
import { UnauthGuard } from "@/infrastructure/ui/guards/UnauthGuard";
import { UsersPage } from "../pages/UsersPage";
import { CreateUserPage } from "@/infrastructure/ui/pages/CreateUserPage";
import { UserDetailsPage } from "@/infrastructure/ui/pages/UserDetailsPage";


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
                element: <UsersPage />,
              },
              {
                path: "personal/nuevo",
                element: <CreateUserPage />,
              },
              {
                path: "personal/:id",
                element: <UserDetailsPage />,
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
                path: "clientes/:id",
                element: <ClientsDetailsPage />,
              },
              {
                path: "sectores/nuevo",
                element: <CreateSectorPage />,
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
