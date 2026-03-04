import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { User, CreateUserInput, UpdateUserInput } from "../../domain";
import type { IUserRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";
import { USER_ENDPOINTS } from "../endpoints/adminEndpoints";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class UserApiRepository implements IUserRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sortBy, sortOrder, search } = params;
    const queryParams: Record<string, string | number> = { page, limit };
    if (sortBy) queryParams.sortBy = sortBy;
    if (sortOrder) queryParams.sortOrder = sortOrder;
    if (search) queryParams.search = search;

    const res = await api.get<ApiResponse<BackendPaginatedResponse<User>>>(
      USER_ENDPOINTS.LIST,
      { params: queryParams },
    );
    const body = res.data.data;
    return {
      items: body.data,
      meta: body.pagination,
    };
  }

  async getById(id: string): Promise<User> {
    const res = await api.get<ApiResponse<User>>(USER_ENDPOINTS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateUserInput): Promise<MutationResult<User>> {
    const res = await api.post<ApiResponse<User>>(USER_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateUserInput): Promise<MutationResult<User>> {
    const res = await api.put<ApiResponse<User>>(USER_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(USER_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
