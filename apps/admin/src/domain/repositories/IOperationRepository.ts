import type { Operation, CreateOperationInput } from "../entities/Operation";
import type { MutationResult, PaginatedResult, ListParams } from "./IUserRepository";

export interface IOperationRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<Operation>>;
  create(input: CreateOperationInput): Promise<MutationResult<Operation>>;
}
