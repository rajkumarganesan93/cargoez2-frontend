import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Screen, CreateScreenInput, UpdateScreenInput } from "../../domain";
import type { IScreenRepository, MutationResult } from "../../domain";
import { SCREEN_ENDPOINTS } from "../endpoints/adminEndpoints";

export class ScreenApiRepository implements IScreenRepository {
  async getByModule(moduleId: string): Promise<Screen[]> {
    const res = await api.get<ApiResponse<Screen[]>>(SCREEN_ENDPOINTS.LIST, {
      params: { moduleId },
    });
    return res.data.data;
  }

  async create(input: CreateScreenInput): Promise<MutationResult<Screen>> {
    const res = await api.post<ApiResponse<Screen>>(SCREEN_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateScreenInput): Promise<MutationResult<Screen>> {
    const res = await api.put<ApiResponse<Screen>>(SCREEN_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(SCREEN_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
