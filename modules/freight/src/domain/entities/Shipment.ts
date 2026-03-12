export interface Shipment {
  uid: string;
  shipmentNumber: string;
  origin: string;
  destination: string;
  mode: string;
  status: string;
  shipperName?: string;
  consigneeName?: string;
  weight?: number;
  weightUnit?: string;
  pieces?: number;
  etd?: string;
  eta?: string;
  remarks?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface CreateShipmentInput {
  shipmentNumber: string;
  origin: string;
  destination: string;
  mode?: string;
  status?: string;
  shipperName?: string;
  consigneeName?: string;
  weight?: number;
  weightUnit?: string;
  pieces?: number;
  etd?: string;
  eta?: string;
  remarks?: string;
}

export type UpdateShipmentInput = Partial<Omit<CreateShipmentInput, "shipmentNumber">>;
