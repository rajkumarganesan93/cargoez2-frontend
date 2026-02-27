import type { User, CreateUserInput } from "../../domain";
import type { IUserRepository, MutationResult } from "../../domain";

export class UserUseCases {
  private readonly repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async listUsers(): Promise<User[]> {
    return this.repository.getAll();
  }

  async getUser(id: string): Promise<User> {
    return this.repository.getById(id);
  }

  async createUser(input: CreateUserInput): Promise<MutationResult<User>> {
    return this.repository.create(input);
  }

  async updateUser(id: string, input: Partial<CreateUserInput>): Promise<MutationResult<User>> {
    return this.repository.update(id, input);
  }

  async disableUser(id: string): Promise<MutationResult<void>> {
    return this.repository.disable(id);
  }
}
