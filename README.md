# 480 Project - React Frontend

Aplicación web de gestión de proyectos, clientes y personal construida con React y TypeScript, siguiendo una arquitectura hexagonal (Ports & Adapters).

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión |
|---|---|---|
| **Framework** | [React](https://react.dev) | 19 |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org) | 6.0 |
| **Bundler** | [Vite](https://vite.dev) | 8 |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com) | 4 |
| **Componentes UI** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) | — |
| **Enrutamiento** | [React Router](https://reactrouter.com) | 7 |
| **Estado global** | [Zustand](https://zustand.docs.pmnd.rs) | 5 |
| **Formularios** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | 7 / 4 |
| **HTTP Client** | [Axios](https://axios-http.com) | 1.x |
| **Iconos** | [Lucide React](https://lucide.dev) | — |
| **Autenticación** | JWT ([jwt-decode](https://github.com/auth0/jwt-decode)) | — |
| **Linting** | ESLint + Prettier | — |

## 📁 Arquitectura del proyecto

El proyecto sigue una **arquitectura hexagonal** con separación clara de responsabilidades:

```
src/
├── application/              # Capa de aplicación
│   └── services/             # Servicios que orquestan la lógica de negocio
├── domain/                   # Capa de dominio
│   ├── entities/             # Entidades y DTOs del dominio
│   ├── exceptions/           # Excepciones personalizadas
│   └── ports/                # Interfaces (puertos) de los repositorios
└── infrastructure/           # Capa de infraestructura
    ├── adapters/             # Implementaciones de los puertos (API calls)
    ├── stores/               # Estado global (Zustand stores)
    └── ui/                   # Interfaz de usuario
        ├── components/       # Componentes reutilizables (shadcn/ui)
        ├── guards/           # Guards de autenticación y autorización
        ├── lib/              # Utilidades (roleChecker, uuid, etc.)
        ├── pages/            # Páginas de la aplicación
        ├── router/           # Configuración de rutas
        ├── styles/           # Estilos globales
        └── validators/       # Esquemas de validación (Zod)
```

## 🚀 Puesta en marcha

### Prerrequisitos

- **Node.js** >= 20
- **npm** >= 10

### Instalación

1. **Clonar el repositorio:**

```bash
git clone https://github.com/CarlosAlbillos/480-project-react-frontend.git
cd 480-project-react-frontend
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (por defecto).

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Ejecuta ESLint sobre el código |

### Configuración de la API

La aplicación se comunica con un backend REST a través de un proxy configurado en Vite. Las peticiones HTTP se realizan con la base URL `/api/`, que se redirige al backend en desarrollo.

> **Nota:** Asegúrate de que el backend esté en ejecución y accesible para que la aplicación funcione correctamente.

## 📄 Páginas principales

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | Inicio de sesión | Público |
| `/` | Dashboard | Autenticado |
| `/proyectos` | Listado de proyectos | Autenticado |
| `/proyectos/:id` | Detalle de proyecto | Autenticado |
| `/proyectos/nuevo` | Crear proyecto | Admin |
| `/personal` | Listado de usuarios | Admin |
| `/personal/:id` | Detalle de usuario | Admin |
| `/personal/nuevo` | Crear usuario | Admin |
| `/clientes` | Listado de clientes | Admin |
| `/clientes/nuevo` | Crear cliente | Admin |
| `/sectores/nuevo` | Crear sector | Admin |