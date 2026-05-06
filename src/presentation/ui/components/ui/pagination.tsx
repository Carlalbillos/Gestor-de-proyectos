import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  if (currentPage === 1 && totalItems < itemsPerPage) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && !isLoading) {
      onPageChange(page);
    }
  };

  const hasNextPage = totalItems >= itemsPerPage;
  const hasPrevPage = currentPage > 1;

  if (!hasNextPage && !hasPrevPage) return null;

  return (
    <div className="flex items-center justify-center space-x-6 py-8">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 h-9 px-4 rounded-full border-muted-foreground/20 hover:bg-primary/5 hover:text-primary transition-all"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="text-sm font-medium bg-muted/50 px-4 py-1.5 rounded-full text-muted-foreground">
        Página {currentPage}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 h-9 px-4 rounded-full border-muted-foreground/20 hover:bg-primary/5 hover:text-primary transition-all"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

