import type { Role, CreateRoleInput, UpdateRoleInput } from "../../domain";
import type { IRoleRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";

export class RoleUseCases {
  constructor(private readonly repository: IRoleRepository) {}

  async listRoles(params?: ListParams): Promise<PaginatedResult<Role>> {
    return this.repository.getAll(params);
  }

  async getRole(id: string): Promise<Role> {
    return this.repository.getById(id);
  }

  async createRole(input: CreateRoleInput): Promise<MutationResult<Role>> {
    return this.repository.create(input);
  }

  async updateRole(id: string, input: UpdateRoleInput): Promise<MutationResult<Role>> {
    return this.repository.update(id, input);
  }

  async deleteRole(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
