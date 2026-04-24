import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "@/infrastructure/ui/pages/LoginPage";
import { AuthGuard } from "@/infrastructure/ui/guards/AuthGuard";
import { DashboardLayout } from "@/infrastructure/ui/components/layout/DashboardLayout";
import { HomePage } from "@/infrastructure/ui/pages/HomePage";

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
            path: "/proyectos",
            element: <div className="p-8 text-center text-muted-foreground">Listado de Proyectos próximamente...</div>,
          },
          {
            path: "/personal",
            element: <div className="p-8 text-center text-muted-foreground">Listado de Personal próximamente...</div>,
          },
        ]
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
