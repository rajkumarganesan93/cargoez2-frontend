import type { Permission, CreatePermissionInput } from "../entities/Permission";
import type { MutationResult, PaginatedResult, ListParams } from "./IUserRepository";

export interface IPermissionRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<Permission>>;
  create(input: CreatePermissionInput): Promise<MutationResult<Permission>>;
  delete(id: string): Promise<MutationResult<void>>;
}
