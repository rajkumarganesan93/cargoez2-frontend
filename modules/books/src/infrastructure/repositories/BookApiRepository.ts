import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../../domain";
import type { IBookRepository, MutationResult } from "../../domain";
import { BOOK_ENDPOINTS } from "../endpoints/bookEndpoints";

export class BookApiRepository implements IBookRepository {
  async getAll(): Promise<BookEntry[]> {
    const res = await api.get<ApiResponse<BookEntry[]>>(BOOK_ENDPOINTS.LIST);
    return res.data.data;
  }

  async getById(id: string): Promise<BookEntry> {
    const res = await api.get<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.DETAIL(id));
    return res.data.data;
  }

  async create(input: CreateBookEntryInput): Promise<MutationResult<BookEntry>> {
    const res = await api.post<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(id: string, input: UpdateBookEntryInput): Promise<MutationResult<BookEntry>> {
    const res = await api.put<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.UPDATE(id), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(id: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(BOOK_ENDPOINTS.DELETE(id));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
