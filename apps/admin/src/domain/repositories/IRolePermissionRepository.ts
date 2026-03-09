import type { RolePermission, AssignPermissionInput, ResolvedPermission, MyPermissions } from "../entities/RolePermission";
import type { MutationResult } from "./IUserRepository";

export interface IRolePermissionRepository {
  getByRole(roleId: string): Promise<RolePermission[]>;
  assign(roleId: string, input: AssignPermissionInput): Promise<MutationResult<RolePermission>>;
  revoke(roleId: string, permissionId: string): Promise<MutationResult<void>>;
  resolve(roles: string): Promise<ResolvedPermission[]>;
  getMyPermissions(): Promise<MyPermissions>;
}
