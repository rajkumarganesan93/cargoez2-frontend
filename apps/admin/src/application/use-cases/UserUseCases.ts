import type { User, CreateUserInput, UpdateUserInput } from "../../domain";
import type { IUserRepository, MutationResult, PaginatedResult } from "../../domain";

export class UserUseCases {
  private readonly repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async listUsers(page?: number, limit?: number): Promise<PaginatedResult<User>> {
    return this.repository.getAll(page, limit);
  }

  async getUser(id: string): Promise<User> {
    return this.repository.getById(id);
  }

  async createUser(input: CreateUserInput): Promise<MutationResult<User>> {
    return this.repository.create(input);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<MutationResult<User>> {
    return this.repository.update(id, input);
  }

  async deleteUser(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
