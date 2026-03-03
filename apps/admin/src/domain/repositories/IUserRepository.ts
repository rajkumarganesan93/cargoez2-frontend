import type { User, CreateUserInput, UpdateUserInput } from "../entities/User";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface IUserRepository {
  getAll(page?: number, limit?: number): Promise<PaginatedResult<User>>;
  getById(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<MutationResult<User>>;
  update(id: string, input: UpdateUserInput): Promise<MutationResult<User>>;
  delete(id: string): Promise<MutationResult<void>>;
}
