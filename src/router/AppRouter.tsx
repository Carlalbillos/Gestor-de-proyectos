// router/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from 'react-router';
import { LoginPage } from '../features/auth/infrastructure/ui/pages/LoginPage';
import { AuthGuard } from '../features/auth/infrastructure/ui/guards/AuthGuard';
import { DashboardPage } from '../pages/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};