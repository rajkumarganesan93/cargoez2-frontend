import type { SystemSettings } from "../../domain";
import type { ISettingsRepository } from "../../domain";
import type { MutationResult } from "../../domain";

export class SettingsUseCases {
  private readonly repository: ISettingsRepository;

  constructor(repository: ISettingsRepository) {
    this.repository = repository;
  }

  async getSettings(): Promise<SystemSettings> {
    return this.repository.get();
  }

  async updateSettings(data: SystemSettings): Promise<MutationResult<SystemSettings>> {
    return this.repository.update(data);
  }
}
