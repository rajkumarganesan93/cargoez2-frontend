import type { SystemSettings } from "../entities/SystemSettings";
import type { MutationResult } from "./IUserRepository";

export interface ISettingsRepository {
  get(): Promise<SystemSettings>;
  update(data: SystemSettings): Promise<MutationResult<SystemSettings>>;
}
