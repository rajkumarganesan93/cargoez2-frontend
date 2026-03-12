import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Contact, CreateContactInput, UpdateContactInput } from "../../domain";
import type { IContactRepository, MutationResult } from "../../domain";
import { CONTACT_ENDPOINTS } from "../endpoints/contactEndpoints";

interface PaginatedData<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class ContactApiRepository implements IContactRepository {
  async getAll(): Promise<Contact[]> {
    const res = await api.get<ApiResponse<PaginatedData<Contact>>>(CONTACT_ENDPOINTS.LIST);
    return res.data.data.data;
  }

  async getById(uid: string): Promise<Contact> {
    const res = await api.get<ApiResponse<Contact>>(CONTACT_ENDPOINTS.DETAIL(uid));
    return res.data.data;
  }

  async create(input: CreateContactInput): Promise<MutationResult<Contact>> {
    const res = await api.post<ApiResponse<Contact>>(CONTACT_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(uid: string, input: UpdateContactInput): Promise<MutationResult<Contact>> {
    const res = await api.put<ApiResponse<Contact>>(CONTACT_ENDPOINTS.UPDATE(uid), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(uid: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(CONTACT_ENDPOINTS.DELETE(uid));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
