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

type SetState<S> = (partial: Partial<S>) => void;
type GetState<S> = () => S;

export function createBaseListSlice<T, StoreState extends BaseListState<T>>(
  set: SetState<StoreState>,
  get: GetState<StoreState>,
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
      set({ search, page: 1 } as Partial<StoreState>);
      fetchAction();
    },

    setFilterStatus: (filterStatus: "all" | "active" | "inactive") => {
      set({ filterStatus, page: 1 } as Partial<StoreState>);
      fetchAction();
    },

    setPage: (page: number) => {
      set({ page } as Partial<StoreState>);
      fetchAction();
    },

    setLimit: (limit: number) => {
      set({ limit, page: 1 } as Partial<StoreState>);
      fetchAction();
    },
  };
}

export interface HandleListFetchOptions {
  /** Optional authorization check. Return false to deny access. */
  authorize?: () => boolean;
  /** Error message shown when authorization fails */
  unauthorizedMessage?: string;
}

export async function handleListFetch<T, StoreState extends BaseListState<T>>(
  set: SetState<StoreState>,
  get: GetState<StoreState>,
  fetchData: () => Promise<T[] | { data: T[]; total: number }>,
  filterData: (items: T[], state: StoreState) => T[],
  options?: HandleListFetchOptions
) {
  set({ isLoading: true, error: null } as Partial<StoreState>);

  try {
    // Authorization check (injected from outside, not hardcoded)
    if (options?.authorize && !options.authorize()) {
      set({
        items: [],
        total: 0,
        isLoading: false,
        error: options.unauthorizedMessage ?? "Sin permisos para acceder",
      } as unknown as Partial<StoreState>);
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
      } as Partial<StoreState>);
    } else {
      // Client-side pagination fallback (when we fetch a large list and filter/page locally)
      const total = allItems.length;
      const start = (page - 1) * limit;
      const paginatedItems = allItems.slice(start, start + limit);

      set({
        items: paginatedItems,
        total,
        isLoading: false,
      } as Partial<StoreState>);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al cargar la lista";
    set({ isLoading: false, error: message } as Partial<StoreState>);
  }
}
