import type { Screen, CreateScreenInput, UpdateScreenInput } from "../../domain";
import type { IScreenRepository, MutationResult } from "../../domain";

export class ScreenUseCases {
  constructor(private readonly repository: IScreenRepository) {}

  async listScreensByModule(moduleId: string): Promise<Screen[]> {
    return this.repository.getByModule(moduleId);
  }

  async createScreen(input: CreateScreenInput): Promise<MutationResult<Screen>> {
    return this.repository.create(input);
  }

  async updateScreen(id: string, input: UpdateScreenInput): Promise<MutationResult<Screen>> {
    return this.repository.update(id, input);
  }

  async deleteScreen(id: string): Promise<MutationResult<void>> {
    return this.repository.delete(id);
  }
}
