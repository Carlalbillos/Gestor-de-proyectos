import { vi, describe, it, expect, beforeEach } from "vitest";
import { useClientsListStore } from "./clients-list.store";
import { useAuthStore } from "@/presentation/modules/auth/stores/auth.store";
import { Email, SystemRole } from "@/domain/value-objects";
import { Client } from "@/domain/entities/client.entity";
import { User } from "@/domain/entities/user.entity";

// Setup mocks for use cases before importing store
const mocks = vi.hoisted(() => ({
  getClientsUseCase: { execute: vi.fn() },
  createClientUseCase: { execute: vi.fn() },
  updateClientUseCase: { execute: vi.fn() },
  deleteClientUseCase: { execute: vi.fn() },
}));

vi.mock("@/infrastructure/di/container", () => ({
  container: mocks,
}));

describe("useClientsListStore", () => {
  const mockClients: Client[] = [
    new Client(
      "client-1",
      "Acme Corporation",
      true,
      { id: "sec-1", name: "Technology" }
    ),
    new Client(
      "client-2",
      "Globex Inc",
      false,
      { id: "sec-2", name: "Finance" }
    ),
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Authenticate user as admin in AuthStore for handleListFetch authorization
    useAuthStore.setState({
      user: new User(
        "admin-123",
        "Admin",
        "User",
        new Email("admin@example.com"),
        new SystemRole("ROLE_ADMIN"),
        true
      ),
      isAuthenticated: true,
    });

    // Reset store state
    useClientsListStore.setState({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      isLoading: false,
      error: null,
      search: "",
      filterStatus: "all",
      isSaving: false,
    });
  });

  it("should have initial default state", () => {
    const state = useClientsListStore.getState();
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.page).toBe(1);
    expect(state.isLoading).toBe(false);
    expect(state.isSaving).toBe(false);
    expect(state.error).toBeNull();
    expect(state.search).toBe("");
    expect(state.filterStatus).toBe("all");
  });

  describe("fetchClients", () => {
    it("should fetch and load clients successfully", async () => {
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);

      await useClientsListStore.getState().fetchClients();

      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({ page: 1 });
      expect(useClientsListStore.getState().items).toEqual(mockClients);
      expect(useClientsListStore.getState().total).toBe(mockClients.length);
      expect(useClientsListStore.getState().isLoading).toBe(false);
      expect(useClientsListStore.getState().error).toBeNull();
    });

    it("should fetch clients with active status query filter", async () => {
      // Server returns only active clients when filtered
      const activeClients = mockClients.filter(c => c.isActive);
      mocks.getClientsUseCase.execute.mockResolvedValue(activeClients);
      useClientsListStore.setState({ filterStatus: "active" });

      await useClientsListStore.getState().fetchClients();

      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        isActive: true,
      });
      expect(useClientsListStore.getState().items).toEqual(activeClients);
    });

    it("should fetch clients with search query filter", async () => {
      // Server returns only matching clients when searched
      const searchResults = [mockClients[1]];
      mocks.getClientsUseCase.execute.mockResolvedValue(searchResults);
      useClientsListStore.setState({ search: "globex" });

      await useClientsListStore.getState().fetchClients();

      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        search: "globex",
      });
      expect(useClientsListStore.getState().items).toEqual(searchResults);
    });

    it("should set error state if fetch clients fails", async () => {
      const errorMsg = "API Connection Error";
      mocks.getClientsUseCase.execute.mockRejectedValue(new Error(errorMsg));

      await useClientsListStore.getState().fetchClients();

      expect(useClientsListStore.getState().isLoading).toBe(false);
      expect(useClientsListStore.getState().error).toBe(errorMsg);
      expect(useClientsListStore.getState().items).toEqual([]);
    });
  });

  describe("addClient", () => {
    it("should execute createClientUseCase and fetch refreshed list", async () => {
      const newClientDto = {
        id: "client-new",
        name: "Initech",
        sectorId: "sec-1",
      };
      mocks.createClientUseCase.execute.mockResolvedValue(undefined);
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);

      const addPromise = useClientsListStore.getState().addClient(newClientDto);

      // Verify loading state is set to saving
      expect(useClientsListStore.getState().isSaving).toBe(true);

      await addPromise;

      expect(mocks.createClientUseCase.execute).toHaveBeenCalledWith(newClientDto);
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalled();
      expect(useClientsListStore.getState().isSaving).toBe(false);
    });
  });

  describe("updateClient", () => {
    it("should execute updateClientUseCase and fetch refreshed list", async () => {
      const updateClientDto = {
        name: "Acme Corp Ltd",
      };
      mocks.updateClientUseCase.execute.mockResolvedValue(undefined);
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);

      const updatePromise = useClientsListStore.getState().updateClient("client-1", updateClientDto);

      expect(useClientsListStore.getState().isSaving).toBe(true);

      await updatePromise;

      expect(mocks.updateClientUseCase.execute).toHaveBeenCalledWith("client-1", updateClientDto);
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalled();
      expect(useClientsListStore.getState().isSaving).toBe(false);
    });
  });

  describe("deleteClient", () => {
    it("should execute deleteClientUseCase and fetch refreshed list", async () => {
      mocks.deleteClientUseCase.execute.mockResolvedValue(undefined);
      mocks.getClientsUseCase.execute.mockResolvedValue([]);

      const deletePromise = useClientsListStore.getState().deleteClient("client-2");

      expect(useClientsListStore.getState().isSaving).toBe(true);

      await deletePromise;

      expect(mocks.deleteClientUseCase.execute).toHaveBeenCalledWith("client-2");
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalled();
      expect(useClientsListStore.getState().isSaving).toBe(false);
    });
  });

  describe("setters", () => {
    it("should set page and fetch clients", async () => {
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);

      useClientsListStore.getState().setPage(3);

      expect(useClientsListStore.getState().page).toBe(3);
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({ page: 3 });
    });

    it("should set search, reset page to 1, and fetch clients", async () => {
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);
      useClientsListStore.setState({ page: 5 });

      useClientsListStore.getState().setSearch("acme");

      expect(useClientsListStore.getState().search).toBe("acme");
      expect(useClientsListStore.getState().page).toBe(1);
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        search: "acme",
      });
    });

    it("should set filter status, reset page to 1, and fetch clients", async () => {
      mocks.getClientsUseCase.execute.mockResolvedValue(mockClients);
      useClientsListStore.setState({ page: 2 });

      useClientsListStore.getState().setFilterStatus("inactive");

      expect(useClientsListStore.getState().filterStatus).toBe("inactive");
      expect(useClientsListStore.getState().page).toBe(1);
      expect(mocks.getClientsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        isActive: false,
      });
    });
  });
});
