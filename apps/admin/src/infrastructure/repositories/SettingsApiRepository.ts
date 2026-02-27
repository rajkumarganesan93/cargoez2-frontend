import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { SystemSettings } from "../../domain";
import type { ISettingsRepository } from "../../domain";
import type { MutationResult } from "../../domain";
import { ADMIN_ENDPOINTS } from "../endpoints/adminEndpoints";

export class SettingsApiRepository implements ISettingsRepository {
  async get(): Promise<SystemSettings> {
    const res = await api.get<ApiResponse<SystemSettings>>(ADMIN_ENDPOINTS.SETTINGS.GET);
    return res.data.data;
  }

  async update(data: SystemSettings): Promise<MutationResult<SystemSettings>> {
    const res = await api.put<ApiResponse<SystemSettings>>(ADMIN_ENDPOINTS.SETTINGS.UPDATE, data);
    return { data: res.data.data, message: res.data.message };
  }
}
