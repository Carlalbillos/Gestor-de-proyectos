import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Hook para manejar la búsqueda reactiva con un input local y debounce
 * sincronizado con una función de búsqueda (generalmente de un store).
 */
export function useSearchFilter(
  initialSearch: string,
  onSearchChange: (value: string) => void,
  delayMs: number = 300
) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, delayMs);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return {
    searchInput,
    setSearchInput,
  } as const;
}
