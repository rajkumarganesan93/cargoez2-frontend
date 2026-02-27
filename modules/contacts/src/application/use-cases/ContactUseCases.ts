import type { Contact, CreateContactInput, UpdateContactInput } from "../../domain";
import type { IContactRepository, MutationResult } from "../../domain";

export class ContactUseCases {
  private readonly repository: IContactRepository;

  constructor(repository: IContactRepository) {
    this.repository = repository;
  }

  async listContacts(): Promise<Contact[]> {
    return this.repository.getAll();
  }

  async getContact(id: string): Promise<Contact> {
    return this.repository.getById(id);
  }

  async createContact(input: CreateContactInput): Promise<MutationResult<Contact>> {
    return this.repository.create(input);
  }

  async updateContact(id: string, input: UpdateContactInput): Promise<MutationResult<Contact>> {
    return this.repository.update(id, input);
  }

  async deleteContact(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
