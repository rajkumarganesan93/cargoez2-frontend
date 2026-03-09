import {
  UserApiRepository,
  SettingsApiRepository,
  RoleApiRepository,
  ModuleApiRepository,
  ScreenApiRepository,
  OperationApiRepository,
  PermissionApiRepository,
  RolePermissionApiRepository,
} from "../infrastructure";
import {
  UserUseCases,
  SettingsUseCases,
  RoleUseCases,
  ModuleUseCases,
  ScreenUseCases,
  OperationUseCases,
  PermissionUseCases,
  RolePermissionUseCases,
} from "../application";

const userRepository = new UserApiRepository();
export const userUseCases = new UserUseCases(userRepository);

const settingsRepository = new SettingsApiRepository();
export const settingsUseCases = new SettingsUseCases(settingsRepository);

const roleRepository = new RoleApiRepository();
export const roleUseCases = new RoleUseCases(roleRepository);

const moduleRepository = new ModuleApiRepository();
export const moduleUseCases = new ModuleUseCases(moduleRepository);

const screenRepository = new ScreenApiRepository();
export const screenUseCases = new ScreenUseCases(screenRepository);

const operationRepository = new OperationApiRepository();
export const operationUseCases = new OperationUseCases(operationRepository);

const permissionRepository = new PermissionApiRepository();
export const permissionUseCases = new PermissionUseCases(permissionRepository);

const rolePermissionRepository = new RolePermissionApiRepository();
export const rolePermissionUseCases = new RolePermissionUseCases(rolePermissionRepository);
