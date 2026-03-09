import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Operation, CreateOperationInput } from "../../domain";
import type { IOperationRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";
import { OPERATION_ENDPOINTS } from "../endpoints/adminEndpoints";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class OperationApiRepository implements IOperationRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<Operation>> {
    const { page = 1, limit = 50 } = params;
    const res = await api.get<ApiResponse<BackendPaginatedResponse<Operation>>>(
      OPERATION_ENDPOINTS.LIST,
      { params: { page, limit } },
    );
    const body = res.data.data;
    return { items: body.data, meta: body.pagination };
  }

  async create(input: CreateOperationInput): Promise<MutationResult<Operation>> {
    const res = await api.post<ApiResponse<Operation>>(OPERATION_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }
}
