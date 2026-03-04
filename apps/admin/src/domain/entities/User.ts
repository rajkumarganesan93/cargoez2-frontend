export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;
