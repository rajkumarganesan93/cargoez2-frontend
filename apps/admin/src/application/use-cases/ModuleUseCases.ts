import type { AppModule, CreateModuleInput, UpdateModuleInput } from "../../domain";
import type { IModuleRepository, MutationResult, PaginatedResult, ListParams } from "../../domain";

export class ModuleUseCases {
  constructor(private readonly repository: IModuleRepository) {}

  async listModules(params?: ListParams): Promise<PaginatedResult<AppModule>> {
    return this.repository.getAll(params);
  }

  async createModule(input: CreateModuleInput): Promise<MutationResult<AppModule>> {
    return this.repository.create(input);
  }

  async updateModule(id: string, input: UpdateModuleInput): Promise<MutationResult<AppModule>> {
    return this.repository.update(id, input);
  }

  async deleteModule(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
