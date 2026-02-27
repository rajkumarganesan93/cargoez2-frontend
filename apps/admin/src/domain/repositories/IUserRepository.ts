import type { User, CreateUserInput } from "../entities/User";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<MutationResult<User>>;
  update(id: string, input: Partial<CreateUserInput>): Promise<MutationResult<User>>;
  disable(id: string): Promise<MutationResult<void>>;
}
