export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: "Pending" | "In Transit" | "Delivered" | "Cancelled";
  weight: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface CreateShipmentInput {
  origin: string;
  destination: string;
  weight: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface UpdateShipmentInput extends Partial<CreateShipmentInput> {}
