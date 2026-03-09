export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
