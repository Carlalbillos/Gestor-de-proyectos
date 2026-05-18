import { useEffect, forwardRef } from "react";
import { useSectorsStore } from "@/presentation/stores/sectors.store";
import { Label } from "@/presentation/components/ui/label";

interface SectorSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const SectorSelect = forwardRef<HTMLSelectElement, SectorSelectProps>(
  ({ label = "Sector", error, className, ...props }, ref) => {
    const { sectors, isLoading, fetchSectors } = useSectorsStore();

    useEffect(() => {
      fetchSectors();
    }, [fetchSectors]);

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
        
        <select
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-destructive" : ""
          } ${className}`}
          {...props}
        >
          <option value="">Selecciona un sector</option>
          {sectors.map((sector) => (
            <option key={sector.id} value={sector.id}>
              {sector.name}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {isLoading && sectors.length === 0 && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Cargando sectores...
          </p>
        )}
      </div>
    );
  }
);

SectorSelect.displayName = "SectorSelect";
