import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../../domain";
import type { IBookRepository, MutationResult } from "../../domain";

export class BookUseCases {
  private readonly repository: IBookRepository;

  constructor(repository: IBookRepository) {
    this.repository = repository;
  }

  async listEntries(): Promise<BookEntry[]> {
    return this.repository.getAll();
  }

  async getEntry(id: string): Promise<BookEntry> {
    return this.repository.getById(id);
  }

  async createEntry(input: CreateBookEntryInput): Promise<MutationResult<BookEntry>> {
    return this.repository.create(input);
  }

  async updateEntry(id: string, input: UpdateBookEntryInput): Promise<MutationResult<BookEntry>> {
    return this.repository.update(id, input);
  }

  async deleteEntry(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
