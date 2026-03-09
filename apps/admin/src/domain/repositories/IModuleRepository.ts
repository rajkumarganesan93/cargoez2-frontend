import type { AppModule, CreateModuleInput, UpdateModuleInput } from "../entities/AppModule";
import type { MutationResult, PaginatedResult, ListParams } from "./IUserRepository";

export interface IModuleRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<AppModule>>;
  create(input: CreateModuleInput): Promise<MutationResult<AppModule>>;
  update(id: string, input: UpdateModuleInput): Promise<MutationResult<AppModule>>;
  delete(id: string): Promise<MutationResult<void>>;
}
