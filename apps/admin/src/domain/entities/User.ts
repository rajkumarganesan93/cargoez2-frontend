export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;
