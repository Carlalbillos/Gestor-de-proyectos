import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { DashboardLayout } from "@/presentation/components/layout/DashboardLayout";

import { LoginPage } from "@/presentation/pages/LoginPage";
import { HomePage } from "@/presentation/pages/HomePage";
import { ProjectsPage } from "@/presentation/pages/ProjectsPage";
import { ProjectDetailsPage } from "@/presentation/pages/ProjectDetailsPage";
import { ClientsPage } from "@/presentation/pages/ClientsPage";
import { CreateClientPage } from "@/presentation/pages/CreateClientPage";
import { ClientsDetailsPage } from "@/presentation/pages/ClientsDetailsPage";
import { SectorPage } from "@/presentation/pages/SectorPage";
import { TechnologiesPage } from "@/presentation/pages/TechnologiesPage";

import { AuthGuard } from "@/presentation/guards/AuthGuard";
import { AdminGuard } from "@/presentation/guards/AdminGuard";
import { UnauthGuard } from "@/presentation/guards/UnauthGuard";
import { UsersPage } from "@/presentation/pages/UsersPage";
import { CreateUserPage } from "@/presentation/pages/CreateUserPage";
import { UserDetailsPage } from "@/presentation/pages/UserDetailsPage";
import { SettingsPage } from "@/presentation/pages/SettingsPage";


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
                path: "proyectos/tecnologias",
                element: <TechnologiesPage />,
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
