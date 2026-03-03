import { api, type ApiResponse, type PaginatedData } from "@rajkumarganesan93/uifunctions";
import type { User, CreateUserInput, UpdateUserInput } from "../../domain";
import type { IUserRepository, MutationResult, PaginatedResult } from "../../domain";
import { USER_ENDPOINTS } from "../endpoints/adminEndpoints";

export class UserApiRepository implements IUserRepository {
  async getAll(page = 1, limit = 10): Promise<PaginatedResult<User>> {
    const res = await api.get<ApiResponse<PaginatedData<User>>>(
      USER_ENDPOINTS.LIST,
      { params: { page, limit } },
    );
    const paginated = res.data.data;
    return { items: paginated.items, meta: paginated.meta };
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
