export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export type UpdateContactInput = Partial<CreateContactInput>;
