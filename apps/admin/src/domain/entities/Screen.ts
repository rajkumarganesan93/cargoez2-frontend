export interface Screen {
  id: string;
  moduleId: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateScreenInput {
  moduleId: string;
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateScreenInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}
