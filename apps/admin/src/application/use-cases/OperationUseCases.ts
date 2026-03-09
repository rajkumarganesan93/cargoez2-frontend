import type { Operation, CreateOperationInput } from "../../domain";
import type { IOperationRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";

export class OperationUseCases {
  constructor(private readonly repository: IOperationRepository) {}

  async listOperations(params?: ListParams): Promise<PaginatedResult<Operation>> {
    return this.repository.getAll(params);
  }

  async createOperation(input: CreateOperationInput): Promise<MutationResult<Operation>> {
    return this.repository.create(input);
  }
}
