import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Role, CreateRoleInput, UpdateRoleInput } from "../../domain";
import type { IRoleRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";
import { ROLE_ENDPOINTS } from "../endpoints/adminEndpoints";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class RoleApiRepository implements IRoleRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<Role>> {
    const { page = 1, limit = 10, sortBy, sortOrder, search } = params;
    const queryParams: Record<string, string | number> = { page, limit };
    if (sortBy) queryParams.sortBy = sortBy;
    if (sortOrder) queryParams.sortOrder = sortOrder;
    if (search) queryParams.search = search;

    const res = await api.get<ApiResponse<BackendPaginatedResponse<Role>>>(
      ROLE_ENDPOINTS.LIST,
      { params: queryParams },
    );
    const body = res.data.data;
    return { items: body.data, meta: body.pagination };
  }

  async getById(id: string): Promise<Role> {
    const res = await api.get<ApiResponse<Role>>(ROLE_ENDPOINTS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateRoleInput): Promise<MutationResult<Role>> {
    const res = await api.post<ApiResponse<Role>>(ROLE_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateRoleInput): Promise<MutationResult<Role>> {
    const res = await api.put<ApiResponse<Role>>(ROLE_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(ROLE_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
