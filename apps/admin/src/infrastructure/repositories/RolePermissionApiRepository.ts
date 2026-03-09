import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import type {
  RolePermission,
  AssignPermissionInput,
  ResolvedPermission,
  MyPermissions,
} from "../../domain";
import type { IRolePermissionRepository, MutationResult } from "../../domain";
import { ROLE_PERMISSION_ENDPOINTS } from "../endpoints/adminEndpoints";

export class RolePermissionApiRepository implements IRolePermissionRepository {
  async getByRole(roleId: string): Promise<RolePermission[]> {
    const res = await api.get<ApiResponse<RolePermission[]>>(
      ROLE_PERMISSION_ENDPOINTS.LIST(roleId),
    );
    return res.data.data;
  }

  async assign(roleId: string, input: AssignPermissionInput): Promise<MutationResult<RolePermission>> {
    const res = await api.post<ApiResponse<RolePermission>>(
      ROLE_PERMISSION_ENDPOINTS.ASSIGN(roleId),
      input,
    );
    return { data: res.data.data, message: res.data.message };
  }

  async revoke(roleId: string, permissionId: string): Promise<MutationResult<void>> {
    const res = await api.del<ApiResponse<void>>(
      ROLE_PERMISSION_ENDPOINTS.REVOKE(roleId, permissionId),
    );
    return { data: undefined as unknown as void, message: res.data.message };
  }

  async resolve(roles: string): Promise<ResolvedPermission[]> {
    const res = await api.get<ApiResponse<{ permissions: ResolvedPermission[] }>>(
      ROLE_PERMISSION_ENDPOINTS.RESOLVE,
      { params: { roles } },
    );
    return res.data.data.permissions;
  }

  async getMyPermissions(): Promise<MyPermissions> {
    const res = await api.get<ApiResponse<MyPermissions>>(ROLE_PERMISSION_ENDPOINTS.ME);
    return res.data.data;
  }
}
