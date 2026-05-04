import { useAuthStore } from "../auth.store";
import { isAdmin } from "../../ui/lib/roleChecker";

export interface BaseListState<T> {
  items: T[];
  total: number;
  isLoading: boolean;
  error: string | null;
  search: string;
  filterStatus: "all" | "active" | "inactive";

  setSearch: (search: string) => void;
  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => void;
}

/**
 * Creates the base state and actions for a list store.
 * Automatically hooks up setSearch and setFilterStatus to call the provided fetch action.
 */
export function createBaseListSlice<T, StoreState extends BaseListState<T>>(
  set: any,
  get: any,
  fetchItemsActionName: keyof StoreState
): BaseListState<T> {
  return {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
    search: "",
    filterStatus: "all",

    setSearch: (search: string) => {
      set({ search });
      const fetchAction = get()[fetchItemsActionName] as () => void;
      fetchAction();
    },

    setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
      set({ filterStatus });
      const fetchAction = get()[fetchItemsActionName] as () => void;
      fetchAction();
    },
  };
}

/**
 * Handles the standard fetch logic for a list store including:
 * - Loading state
 * - Error handling
 * - Authentication & Authorization checks
 * - Execution of the API call
 * - Client-side filtering
 */
export async function handleListFetch<T, StoreState extends BaseListState<T>>(
  set: any,
  get: any,
  fetchData: () => Promise<T[]>,
  filterData: (items: T[], state: StoreState) => T[],
  requireAdmin: boolean = true
) {
  const user = useAuthStore.getState().user;
  const isAdminUser = isAdmin(user);

  set({ isLoading: true, error: null });

  try {
    if (!user || (requireAdmin && !isAdminUser)) {
      set({ items: [], total: 0, isLoading: false, error: "Sin permisos para acceder" });
      return;
    }

    let allItems = await fetchData();

    allItems = filterData(allItems, get() as StoreState);

    set({ items: allItems, total: allItems.length, isLoading: false });
  } catch (error: any) {
    set({ isLoading: false, error: error.message || "Error al cargar la lista" });
  }
}
