import { useState, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { RolePermission, AssignPermissionInput, MyPermissions } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { rolePermissionUseCases } from "../../di/container";

export function useRolePermissionList() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchByRole = useCallback(async (roleId: string) => {
    if (!roleId) { setRolePermissions([]); return; }
    setLoading(true);
    try {
      const result = await rolePermissionUseCases.getPermissionsByRole(roleId);
      setRolePermissions(result);
    } catch (err) {
      showToast("error", (err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return { rolePermissions, loading, fetchByRole };
}

export function useRolePermissionMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const assignPermission = async (roleId: string, data: AssignPermissionInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await rolePermissionUseCases.assignPermission(roleId, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const revokePermission = async (roleId: string, permissionId: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await rolePermissionUseCases.revokePermission(roleId, permissionId);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, assignPermission, revokePermission };
}

export function useMyPermissions() {
  const [myPermissions, setMyPermissions] = useState<MyPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchMyPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await rolePermissionUseCases.getMyPermissions();
      setMyPermissions(result);
    } catch (err) {
      showToast("error", (err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return { myPermissions, loading, fetchMyPermissions };
}
