export interface AppModule {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateModuleInput {
  code: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

export interface UpdateModuleInput {
  name?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}
