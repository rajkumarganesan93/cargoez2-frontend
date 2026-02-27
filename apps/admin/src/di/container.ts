import { UserApiRepository } from "../infrastructure";
import { SettingsApiRepository } from "../infrastructure";
import { UserUseCases } from "../application";
import { SettingsUseCases } from "../application";

const userRepository = new UserApiRepository();
export const userUseCases = new UserUseCases(userRepository);

const settingsRepository = new SettingsApiRepository();
export const settingsUseCases = new SettingsUseCases(settingsRepository);
