import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useProjectsListStore } from "@/presentation/modules/project/stores/projects-list.store";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { isAdmin } from "@/domain/services/role.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  PageHeader,
  Button,
  Input,
  Pagination,
} from "@/presentation/ui";
import { Building2, Users, Search, FolderPlus } from "lucide-react";
import { useSearchFilter } from "@/presentation/hooks/useSearchFilter";
import { useDisclosure } from "@/presentation/hooks/useDisclosure";
import { ProjectForm } from "@/presentation/modules/project/components/ProjectForm";
import { uuidv7 } from "@/presentation/ui/lib/uuid";

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    items: projects,
    total,
    page,
    limit,
    isSaving,
    search,
    filterStatus,
    fetchProjects,
    setSearch,
    setFilterStatus,
    setPage,
    addProject,
  } = useProjectsListStore();

  const { searchInput, setSearchInput } = useSearchFilter(search, setSearch, 400);
  const addModal = useDisclosure();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [fetchProjects, user]);

  const handleSubmit = async (data: any) => {
    try {
      await addProject({
        id: uuidv7(),
        ...data,
      });
      addModal.close();
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  const handleCancel = () => addModal.close();

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader
        title="Proyectos"
        description="Gestiona los proyectos de tu organización"
      >
        {isAdmin(user) && (
          <Button onClick={addModal.open}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
        )}
      </PageHeader>

      {addModal.isOpen && (
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      )}

      <Card className="border-muted shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar proyectos por nombre..."
                className="pl-9 bg-muted/30 h-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="sr-only" htmlFor="project-filter-status">
                Filtrar estado
              </label>
              <select
                id="project-filter-status"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as "all" | "active" | "inactive")
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer group bg-card relative overflow-hidden"
              onClick={() => navigate(`/proyectos/${project.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-1">
                  <StatusBadge isActive={project.isActive} />
                </div>
                <CardTitle
                  className="group-hover:text-primary transition-colors line-clamp-1"
                  title={project.name}
                >
                  {project.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 h-10 mt-1">
                  {project.description ||
                    "Este proyecto no tiene una descripción detallada asignada."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="space-y-3 mt-2">
                  {project.client && (
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/40 p-2 rounded-md">
                      <Building2 className="mr-2.5 h-4 w-4 text-primary/60" />
                      <span
                        className="font-medium text-foreground/80 line-clamp-1"
                        title={project.client.name}
                      >
                        {project.client.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground px-2">
                    <Users className="mr-2.5 h-4 w-4 text-muted-foreground/70" />
                    {project.teamMembers != null && (
                      <span>{project.teamMembers} miembros</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Pagination
          totalPages={total >= limit ? page + 1 : page}
          currentPage={page}
          onPageChange={setPage}
        />
      </>
    </div>
  );
};