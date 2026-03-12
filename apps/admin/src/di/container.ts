import { SettingsApiRepository } from "../infrastructure";
import { SettingsUseCases } from "../application";

const settingsRepository = new SettingsApiRepository();
export const settingsUseCases = new SettingsUseCases(settingsRepository);
