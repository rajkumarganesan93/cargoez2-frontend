import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { User, CreateUserInput } from "../../domain";
import type { IUserRepository, MutationResult } from "../../domain";
import { ADMIN_ENDPOINTS } from "../endpoints/adminEndpoints";

export class UserApiRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>(ADMIN_ENDPOINTS.USERS.LIST);
    return res.data.data;
  }

  async getById(id: string): Promise<User> {
    const res = await api.get<ApiResponse<User>>(ADMIN_ENDPOINTS.USERS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateUserInput): Promise<MutationResult<User>> {
    const res = await api.post<ApiResponse<User>>(ADMIN_ENDPOINTS.USERS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: Partial<CreateUserInput>): Promise<MutationResult<User>> {
    const res = await api.put<ApiResponse<User>>(ADMIN_ENDPOINTS.USERS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async disable(id: string): Promise<MutationResult<void>> {
    const res = await api.patch<ApiResponse<void>>(ADMIN_ENDPOINTS.USERS.DISABLE(id), {});
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
