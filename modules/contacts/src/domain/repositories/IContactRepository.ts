import type { Contact, CreateContactInput, UpdateContactInput } from "../entities/Contact";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IContactRepository {
  getAll(): Promise<Contact[]>;
  getById(uid: string): Promise<Contact>;
  create(input: CreateContactInput): Promise<MutationResult<Contact>>;
  update(uid: string, input: UpdateContactInput): Promise<MutationResult<Contact>>;
  delete(uid: string): Promise<MutationResult<void>>;
}
