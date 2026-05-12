import { useAuthStore } from "../auth.store";
import { isAdmin } from "@/domain/services/role.service";

export interface BaseListState<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  search: string;
  filterStatus: "all" | "active" | "inactive";

  setSearch: (search: string) => void;
  setFilterStatus: (filterStatus: "all" | "active" | "inactive") => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function createBaseListSlice<T, StoreState extends BaseListState<T>>(
  set: any,
  get: any,
  fetchItemsActionName: keyof StoreState
): BaseListState<T> {
  const fetchAction = () => (get()[fetchItemsActionName] as () => void)();

  return {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    isLoading: false,
    error: null,
    search: "",
    filterStatus: "all",

    setSearch: (search: string) => {
      set({ search, page: 1 }); // Reset to page 1 on search
      fetchAction();
    },

    setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
      set({ filterStatus, page: 1 }); // Reset to page 1 on filter change
      fetchAction();
    },

    setPage: (page: number) => {
      set({ page });
      fetchAction();
    },

    setLimit: (limit: number) => {
      set({ limit, page: 1 });
      fetchAction();
    },
  };
}

export async function handleListFetch<T, StoreState extends BaseListState<T>>(
  set: any,
  get: any,
  fetchData: () => Promise<T[] | { data: T[]; total: number }>,
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

    const response = await fetchData();
    let allItems: T[];
    let serverTotal: number | undefined;

    if (Array.isArray(response)) {
      allItems = response;
    } else {
      allItems = response.data;
      serverTotal = response.total;
    }

    allItems = filterData(allItems, get() as StoreState);

    const { page, limit } = get() as StoreState;

    // If serverTotal is provided, we assume the server already paginated
    if (serverTotal !== undefined && allItems.length <= limit) {
      set({
        items: allItems,
        total: serverTotal,
        isLoading: false,
      });
    } else {
      // Client-side pagination fallback (when we fetch a large list and filter/page locally)
      const total = allItems.length;
      const start = (page - 1) * limit;
      const paginatedItems = allItems.slice(start, start + limit);

      set({
        items: paginatedItems,
        total,
        isLoading: false,
      });
    }
  } catch (error: any) {
    set({ isLoading: false, error: error.message || "Error al cargar la lista" });
  }
}

