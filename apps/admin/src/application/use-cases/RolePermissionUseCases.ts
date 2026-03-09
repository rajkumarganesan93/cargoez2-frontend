import type { RolePermission, AssignPermissionInput, ResolvedPermission, MyPermissions } from "../../domain";
import type { IRolePermissionRepository, MutationResult } from "../../domain";

export class RolePermissionUseCases {
  constructor(private readonly repository: IRolePermissionRepository) {}

  async getPermissionsByRole(roleId: string): Promise<RolePermission[]> {
    return this.repository.getByRole(roleId);
  }

  async assignPermission(roleId: string, input: AssignPermissionInput): Promise<MutationResult<RolePermission>> {
    return this.repository.assign(roleId, input);
  }

  async revokePermission(roleId: string, permissionId: string): Promise<MutationResult<void>> {
    return this.repository.revoke(roleId, permissionId);
  }

  async resolvePermissions(roles: string): Promise<ResolvedPermission[]> {
    return this.repository.resolve(roles);
  }

  async getMyPermissions(): Promise<MyPermissions> {
    return this.repository.getMyPermissions();
  }
}
