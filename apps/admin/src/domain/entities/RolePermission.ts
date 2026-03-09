export interface AbacConditions {
  tenant_isolation?: boolean;
  ownership_only?: boolean;
  department?: string[];
  max_amount?: number;
  time_window?: { from: string; to: string };
  custom_rules?: Array<{ field: string; operator: string; values: unknown[] }>;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permissionKey?: string;
  conditions?: AbacConditions | null;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface AssignPermissionInput {
  permissionId: string;
  conditions?: AbacConditions | null;
}

export interface ResolvedPermission {
  key: string;
  conditions: Record<string, unknown> | null;
}

export interface MyPermissionsModule {
  code: string;
  name: string;
  icon: string | null;
  screens: Array<{
    code: string;
    name: string;
    operations: string[];
  }>;
}

export interface MyPermissions {
  roles: string[];
  modules: MyPermissionsModule[];
}
