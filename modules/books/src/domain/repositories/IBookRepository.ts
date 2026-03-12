import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../entities/BookEntry";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IBookRepository {
  getAll(): Promise<BookEntry[]>;
  getById(uid: string): Promise<BookEntry>;
  create(input: CreateBookEntryInput): Promise<MutationResult<BookEntry>>;
  update(uid: string, input: UpdateBookEntryInput): Promise<MutationResult<BookEntry>>;
  delete(uid: string): Promise<MutationResult<void>>;
}
