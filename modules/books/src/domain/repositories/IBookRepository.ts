import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../entities/BookEntry";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IBookRepository {
  getAll(): Promise<BookEntry[]>;
  getById(id: string): Promise<BookEntry>;
  create(input: CreateBookEntryInput): Promise<MutationResult<BookEntry>>;
  update(id: string, input: UpdateBookEntryInput): Promise<MutationResult<BookEntry>>;
  delete(id: string): Promise<MutationResult<void>>;
}
