import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../../domain";
import type { IFreightRepository, MutationResult } from "../../domain";

export class FreightUseCases {
  private readonly repository: IFreightRepository;

  constructor(repository: IFreightRepository) {
    this.repository = repository;
  }

  async listShipments(): Promise<Shipment[]> {
    return this.repository.getAll();
  }

  async getShipment(id: string): Promise<Shipment> {
    return this.repository.getById(id);
  }

  async createShipment(input: CreateShipmentInput): Promise<MutationResult<Shipment>> {
    return this.repository.create(input);
  }

  async updateShipment(id: string, input: UpdateShipmentInput): Promise<MutationResult<Shipment>> {
    return this.repository.update(id, input);
  }

  async deleteShipment(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
