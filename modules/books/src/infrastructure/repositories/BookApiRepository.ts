import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../../domain";
import type { IBookRepository, MutationResult } from "../../domain";
import { BOOK_ENDPOINTS } from "../endpoints/bookEndpoints";

interface PaginatedData<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class BookApiRepository implements IBookRepository {
  async getAll(): Promise<BookEntry[]> {
    const res = await api.get<ApiResponse<PaginatedData<BookEntry>>>(BOOK_ENDPOINTS.LIST);
    return res.data.data.data;
  }

  async getById(uid: string): Promise<BookEntry> {
    const res = await api.get<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.DETAIL(uid));
    return res.data.data;
  }

  async create(input: CreateBookEntryInput): Promise<MutationResult<BookEntry>> {
    const res = await api.post<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }

  async update(uid: string, input: UpdateBookEntryInput): Promise<MutationResult<BookEntry>> {
    const res = await api.put<ApiResponse<BookEntry>>(BOOK_ENDPOINTS.UPDATE(uid), input);
    return { data: res.data.data, message: res.data.message };
  }

  async delete(uid: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(BOOK_ENDPOINTS.DELETE(uid));
    return { data: undefined as unknown as void, message: res.data.message };
  }
}
