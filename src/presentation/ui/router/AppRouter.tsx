import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { DashboardLayout } from "@/presentation/ui/components/layout/DashboardLayout";

import { LoginPage } from "@/presentation/ui/pages/LoginPage";
import { HomePage } from "@/presentation/ui/pages/HomePage";
import { ProjectsPage } from "@/presentation/ui/pages/ProjectsPage";
import { CreateProjectPage } from "@/presentation/ui/pages/CreateProjectPage";
import { ProjectDetailsPage } from "@/presentation/ui/pages/ProjectDetailsPage";
import { ClientsPage } from "@/presentation/ui/pages/ClientsPage";
import { CreateClientPage } from "@/presentation/ui/pages/CreateClientPage";
import { ClientsDetailsPage } from "@/presentation/ui/pages/ClientsDetailsPage";
import { SectorPage } from "@/presentation/ui/pages/SectorPage";

import { AuthGuard } from "@/presentation/ui/guards/AuthGuard";
import { AdminGuard } from "@/presentation/ui/guards/AdminGuard";
import { UnauthGuard } from "@/presentation/ui/guards/UnauthGuard";
import { UsersPage } from "../pages/UsersPage";
import { CreateUserPage } from "@/presentation/ui/pages/CreateUserPage";
import { UserDetailsPage } from "@/presentation/ui/pages/UserDetailsPage";
import { SettingsPage } from "@/presentation/ui/pages/SettingsPage";


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
            path: "configuracion",
            element: <SettingsPage />,
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
                path: "clientes/sectores",
                element: <SectorPage />,
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
