import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../entities/Shipment";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IFreightRepository {
  getAll(): Promise<Shipment[]>;
  getById(uid: string): Promise<Shipment>;
  create(input: CreateShipmentInput): Promise<MutationResult<Shipment>>;
  update(uid: string, input: UpdateShipmentInput): Promise<MutationResult<Shipment>>;
  delete(uid: string): Promise<MutationResult<void>>;
}
