import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { Contact, CreateContactInput, UpdateContactInput } from "../../domain";
import type { IContactRepository, MutationResult } from "../../domain";
import { CONTACT_ENDPOINTS } from "../endpoints/contactEndpoints";

export class ContactApiRepository implements IContactRepository {
  async getAll(): Promise<Contact[]> {
    const res = await api.get<ApiResponse<Contact[]>>(CONTACT_ENDPOINTS.LIST);
    return res.data.data;
  }

  async getById(id: string): Promise<Contact> {
    const res = await api.get<ApiResponse<Contact>>(CONTACT_ENDPOINTS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateContactInput): Promise<MutationResult<Contact>> {
    const res = await api.post<ApiResponse<Contact>>(CONTACT_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateContactInput): Promise<MutationResult<Contact>> {
    const res = await api.put<ApiResponse<Contact>>(CONTACT_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(CONTACT_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
