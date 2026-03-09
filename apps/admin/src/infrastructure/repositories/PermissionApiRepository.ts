import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Permission, CreatePermissionInput } from "../../domain";
import type { IPermissionRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";
import { PERMISSION_ENDPOINTS } from "../endpoints/adminEndpoints";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class PermissionApiRepository implements IPermissionRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<Permission>> {
    const { page = 1, limit = 100, search } = params;
    const queryParams: Record<string, string | number> = { page, limit };
    if (search) queryParams.search = search;

    const res = await api.get<ApiResponse<BackendPaginatedResponse<Permission>>>(
      PERMISSION_ENDPOINTS.LIST,
      { params: queryParams },
    );
    const body = res.data.data;
    return { items: body.data, meta: body.pagination };
  }

  async create(input: CreatePermissionInput): Promise<MutationResult<Permission>> {
    const res = await api.post<ApiResponse<Permission>>(PERMISSION_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(PERMISSION_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
