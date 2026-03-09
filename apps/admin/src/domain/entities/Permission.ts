export interface Permission {
  id: string;
  moduleId: string;
  screenId: string;
  operationId: string;
  permissionKey: string;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreatePermissionInput {
  moduleId: string;
  screenId: string;
  operationId: string;
}
