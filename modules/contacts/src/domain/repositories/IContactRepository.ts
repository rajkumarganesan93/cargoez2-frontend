import type { Contact, CreateContactInput, UpdateContactInput } from "../entities/Contact";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IContactRepository {
  getAll(): Promise<Contact[]>;
  getById(id: string): Promise<Contact>;
  create(input: CreateContactInput): Promise<MutationResult<Contact>>;
  update(id: string, input: UpdateContactInput): Promise<MutationResult<Contact>>;
  delete(id: string): Promise<MutationResult<void>>;
}
