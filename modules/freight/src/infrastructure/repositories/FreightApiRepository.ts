import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../../domain";
import type { IFreightRepository, MutationResult } from "../../domain";
import { FREIGHT_ENDPOINTS } from "../endpoints/freightEndpoints";

interface PaginatedData<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class FreightApiRepository implements IFreightRepository {
  async getAll(): Promise<Shipment[]> {
    const res = await api.get<ApiResponse<PaginatedData<Shipment>>>(FREIGHT_ENDPOINTS.LIST);
    return res.data.data.data;
  }

  async getById(uid: string): Promise<Shipment> {
    const res = await api.get<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.DETAIL(uid));
    return res.data.data;
  }

  async create(input: CreateShipmentInput): Promise<MutationResult<Shipment>> {
    const res = await api.post<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(uid: string, input: UpdateShipmentInput): Promise<MutationResult<Shipment>> {
    const res = await api.put<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.UPDATE(uid), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(uid: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(FREIGHT_ENDPOINTS.DELETE(uid));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
