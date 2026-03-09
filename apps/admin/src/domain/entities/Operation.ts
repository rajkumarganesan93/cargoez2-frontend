export interface Operation {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateOperationInput {
  code: string;
  name: string;
  description?: string;
}
