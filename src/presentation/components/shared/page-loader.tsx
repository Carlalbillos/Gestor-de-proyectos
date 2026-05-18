import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/presentation/ui/lib/utils";

interface PageLoaderProps {
  /** Texto que aparece bajo el spinner. */
  message?: string;
  /**
   * `"list"` — usado inline dentro de una página de listado (padding vertical generoso).
   * `"detail"` — usado como early return en páginas de detalle (altura mínima fija).
   */
  variant?: "list" | "detail";
  className?: string;
}

/**
 * Spinner de carga reutilizable para páginas de listado y de detalle.
 *
 * @example Lista
 * {isLoading && items.length === 0 && <PageLoader message="Cargando clientes..." />}
 *
 * @example Detalle (early return)
 * if (isLoading && !entity) return <PageLoader variant="detail" message="Cargando..." />;
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  message,
  variant = "list",
  className,
}) => {
  const isDetail = variant === "detail";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4",
        isDetail ? "min-h-[400px]" : "py-24",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin",
          isDetail ? "h-10 w-10 text-primary" : "h-10 w-8 text-primary/60"
        )}
      />
      {message && (
        <p
          className={cn(
            "text-muted-foreground",
            isDetail ? "animate-pulse" : "text-sm"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
};
