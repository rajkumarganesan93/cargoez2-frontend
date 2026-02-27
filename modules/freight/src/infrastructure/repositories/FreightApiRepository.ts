import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../../domain";
import type { IFreightRepository, MutationResult } from "../../domain";
import { FREIGHT_ENDPOINTS } from "../endpoints/freightEndpoints";

export class FreightApiRepository implements IFreightRepository {
  async getAll(): Promise<Shipment[]> {
    const res = await api.get<ApiResponse<Shipment[]>>(FREIGHT_ENDPOINTS.LIST);
    return res.data.data;
  }

  async getById(id: string): Promise<Shipment> {
    const res = await api.get<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateShipmentInput): Promise<MutationResult<Shipment>> {
    const res = await api.post<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateShipmentInput): Promise<MutationResult<Shipment>> {
    const res = await api.put<ApiResponse<Shipment>>(FREIGHT_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(FREIGHT_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
