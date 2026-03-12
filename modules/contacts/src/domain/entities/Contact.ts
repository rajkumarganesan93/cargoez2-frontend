export interface Contact {
  uid: string;
  contactType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateContactInput {
  contactType: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export type UpdateContactInput = Partial<CreateContactInput>;
