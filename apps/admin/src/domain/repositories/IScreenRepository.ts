import type { Screen, CreateScreenInput, UpdateScreenInput } from "../entities/Screen";
import type { MutationResult } from "./IUserRepository";

export interface IScreenRepository {
  getByModule(moduleId: string): Promise<Screen[]>;
  create(input: CreateScreenInput): Promise<MutationResult<Screen>>;
  update(id: string, input: UpdateScreenInput): Promise<MutationResult<Screen>>;
  delete(id: string): Promise<MutationResult<void>>;
}
