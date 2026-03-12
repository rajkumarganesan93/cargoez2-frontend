export interface BookEntry {
  uid: string;
  invoiceNumber: string;
  contactUid?: string;
  shipmentUid?: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateBookEntryInput {
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  contactUid?: string;
  shipmentUid?: string;
  dueDate?: string;
  notes?: string;
}

export type UpdateBookEntryInput = Partial<CreateBookEntryInput>;
