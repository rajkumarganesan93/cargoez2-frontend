import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { AppModule, CreateModuleInput, UpdateModuleInput } from "../../domain";
import type { IModuleRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";
import { MODULE_ENDPOINTS } from "../endpoints/adminEndpoints";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class ModuleApiRepository implements IModuleRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<AppModule>> {
    const { page = 1, limit = 50, sortBy = "sortOrder", sortOrder = "asc" } = params;
    const queryParams: Record<string, string | number> = { page, limit, sortBy, sortOrder };

    const res = await api.get<ApiResponse<BackendPaginatedResponse<AppModule>>>(
      MODULE_ENDPOINTS.LIST,
      { params: queryParams },
    );
    const body = res.data.data;
    return { items: body.data, meta: body.pagination };
  }

  async create(input: CreateModuleInput): Promise<MutationResult<AppModule>> {
    const res = await api.post<ApiResponse<AppModule>>(MODULE_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateModuleInput): Promise<MutationResult<AppModule>> {
    const res = await api.put<ApiResponse<AppModule>>(MODULE_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(MODULE_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
