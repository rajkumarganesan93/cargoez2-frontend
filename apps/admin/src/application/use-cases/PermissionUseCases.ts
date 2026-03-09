import type { Permission, CreatePermissionInput } from "../../domain";
import type { IPermissionRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";

export class PermissionUseCases {
  constructor(private readonly repository: IPermissionRepository) {}

  async listPermissions(params?: ListParams): Promise<PaginatedResult<Permission>> {
    return this.repository.getAll(params);
  }

  async createPermission(input: CreatePermissionInput): Promise<MutationResult<Permission>> {
    return this.repository.create(input);
  }

  async deletePermission(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
