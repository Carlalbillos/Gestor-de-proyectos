import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "../features/auth/infrastructure/ui/pages/LoginPage";
import { AuthGuard } from "../features/auth/infrastructure/ui/guards/AuthGuard";
import { useAuthStore } from "../features/auth/infrastructure/stores/auth.store";

const Home = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="">
      <h1 className="">Bienvenido a 480:PROJECTS</h1>
      <div className="">
        <p className="">Tu Token JWT:</p>
        <code className="text-sm">{token}</code>
      </div>
    </div>
  );
};

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
        element: <Home />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
