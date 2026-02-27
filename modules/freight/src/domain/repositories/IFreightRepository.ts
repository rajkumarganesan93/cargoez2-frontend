import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../entities/Shipment";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IFreightRepository {
  getAll(): Promise<Shipment[]>;
  getById(id: string): Promise<Shipment>;
  create(input: CreateShipmentInput): Promise<MutationResult<Shipment>>;
  update(id: string, input: UpdateShipmentInput): Promise<MutationResult<Shipment>>;
  delete(id: string): Promise<MutationResult<void>>;
}
