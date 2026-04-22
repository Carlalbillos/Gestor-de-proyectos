// pages/DashboardPage.tsx
import { useAuthStore } from "../features/auth/infrastructure/stores/auth.store";
import s from "./DashboardPage.module.scss";

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h2 className={s.brand}>480:DEV PROJECTS</h2>
        <button className={s.logout} onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      <main className={s.content}>
        <h1 className={s.title}>Dashboard</h1>
        <p className={s.welcome}>Bienvenido, {user?.email}</p>
      </main>
    </div>
  );
};

