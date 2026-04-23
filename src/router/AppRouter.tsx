import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "../features/auth/infrastructure/ui/pages/LoginPage";
import { AuthGuard } from "../features/auth/infrastructure/ui/guards/AuthGuard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <div className="p-4">Bienvenido a 480:PROJECTS</div>,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
