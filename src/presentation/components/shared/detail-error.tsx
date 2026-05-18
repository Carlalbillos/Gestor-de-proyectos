import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";

interface DetailErrorProps {
  /** Mensaje de error a mostrar. */
  message: string;
  /** Texto del título sobre el error (default: "Error al cargar"). */
  title?: string;
  /** Etiqueta del botón de vuelta (default: "Volver al listado"). */
  backLabel?: string;
  /** Callback al pulsar el botón de vuelta. */
  onBack: () => void;
}

/**
 * Error card reutilizable para páginas de detalle cuando falla la carga inicial.
 *
 * @example
 * if (error && !entity) {
 *   return (
 *     <DetailError
 *       message={error}
 *       title="Error al cargar el cliente"
 *       backLabel="Volver a Clientes"
 *       onBack={() => navigate("/clientes")}
 *     />
 *   );
 * }
 */
export const DetailError: React.FC<DetailErrorProps> = ({
  message,
  title = "Error al cargar",
  backLabel = "Volver al listado",
  onBack,
}) => {
  return (
    <Card className="border-destructive/20 bg-destructive/5 mt-8">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <XCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive">{title}</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{message}</p>
        <Button variant="outline" className="mt-6" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      </CardContent>
    </Card>
  );
};
