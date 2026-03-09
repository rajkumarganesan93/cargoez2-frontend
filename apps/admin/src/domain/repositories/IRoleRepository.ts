import type { Role, CreateRoleInput, UpdateRoleInput } from "../entities/Role";
import type { MutationResult, PaginatedResult, ListParams } from "./IUserRepository";

export interface IRoleRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<Role>>;
  getById(id: string): Promise<Role>;
  create(input: CreateRoleInput): Promise<MutationResult<Role>>;
  update(id: string, input: UpdateRoleInput): Promise<MutationResult<Role>>;
  delete(id: string): Promise<MutationResult<void>>;
}
