export interface BookEntry {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
  notes?: string;
}

export interface CreateBookEntryInput {
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  notes?: string;
}

export interface UpdateBookEntryInput extends Partial<CreateBookEntryInput> {}
