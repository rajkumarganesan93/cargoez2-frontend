import type { User, CreateUserInput, UpdateUserInput } from "../entities/User";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface IUserRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<User>>;
  getById(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<MutationResult<User>>;
  update(id: string, input: UpdateUserInput): Promise<MutationResult<User>>;
  delete(id: string): Promise<MutationResult<void>>;
}
