import { useState, useEffect, useCallback } from "react";
import { Button } from "@rajkumarganesan93/uicontrols";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";
import { useAuth, usePermissions } from "@rajkumarganesan93/auth";
import {
  ADMIN_ROLE_ENDPOINTS,
  ADMIN_PERMISSION_ENDPOINTS,
  ADMIN_ROLE_PERMISSION_ENDPOINTS,
} from "../../infrastructure/endpoints/adminEndpoints";

interface AdminRole { uid: string; code: string; name: string; }
interface AdminPermission { uid: string; permission_key: string; }
interface RolePermission { uid: string; admin_role_uid: string; admin_permission_uid: string; }

export default function AdminRolePermissionPage() {
  const { token } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();
  const canCreate = can("create", "admin-access-control");
  const canDelete = can("delete", "admin-access-control");

  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [allPermissions, setAllPermissions] = useState<AdminPermission[]>([]);
  const [selectedRoleUid, setSelectedRoleUid] = useState<string>("");
  const [assignedPerms, setAssignedPerms] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get<any>(ADMIN_ROLE_ENDPOINTS.LIST, { params: { limit: 100 } }),
          api.get<any>(ADMIN_PERMISSION_ENDPOINTS.LIST, { params: { limit: 200 } }),
        ]);
        setRoles(rolesRes.data.data?.data ?? []);
        setAllPermissions(permsRes.data.data?.data ?? []);
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || "Failed to load roles/permissions");
      }
    })();
  }, [token, showToast]);

  const fetchAssigned = useCallback(async (roleUid: string) => {
    if (!roleUid) { setAssignedPerms([]); return; }
    setLoading(true);
    try {
      const res = await api.get<any>(ADMIN_ROLE_PERMISSION_ENDPOINTS.BY_ROLE(roleUid));
      setAssignedPerms(res.data.data ?? []);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to fetch role permissions");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (selectedRoleUid) fetchAssigned(selectedRoleUid);
  }, [selectedRoleUid, fetchAssigned]);

  const assignedPermUids = new Set(assignedPerms.map((rp) => rp.admin_permission_uid));

  const handleAssign = async (permUid: string) => {
    setSaving(true);
    try {
      await api.post(ADMIN_ROLE_PERMISSION_ENDPOINTS.ASSIGN, {
        adminRoleUid: selectedRoleUid,
        adminPermissionUid: permUid,
      });
      showToast("success", "Permission assigned");
      await fetchAssigned(selectedRoleUid);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to assign");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (permUid: string) => {
    const mapping = assignedPerms.find((rp) => rp.admin_permission_uid === permUid);
    if (!mapping) return;
    setSaving(true);
    try {
      await api.del(ADMIN_ROLE_PERMISSION_ENDPOINTS.REVOKE(mapping.uid));
      showToast("success", "Permission revoked");
      await fetchAssigned(selectedRoleUid);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to revoke");
    } finally {
      setSaving(false);
    }
  };

  const selectedRole = roles.find((r) => r.uid === selectedRoleUid);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Role Permissions</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-1">Select Admin Role</label>
        <select
          value={selectedRoleUid}
          onChange={(e) => setSelectedRoleUid(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-grey-300 rounded-lg text-sm bg-bg-paper text-text-primary"
        >
          <option value="">-- Select a role --</option>
          {roles.map((r) => (
            <option key={r.uid} value={r.uid}>{r.name} ({r.code})</option>
          ))}
        </select>
      </div>

      {selectedRoleUid && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Permissions for: {selectedRole?.name}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {assignedPerms.length} of {allPermissions.length} permissions assigned
          </p>

          {loading ? (
            <div className="py-8 text-center text-text-secondary">Loading...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-grey-300">
              <table className="w-full text-left">
                <thead className="bg-grey-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Permission Key</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allPermissions.map((perm) => {
                    const isAssigned = assignedPermUids.has(perm.uid);
                    return (
                      <tr key={perm.uid} className="border-t border-grey-300 hover:bg-action-hover">
                        <td className="px-4 py-3 text-sm font-mono text-text-primary">
                          {perm.permission_key}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isAssigned ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-grey-200 text-text-secondary">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isAssigned ? (
                            canDelete && (
                              <Button
                                label="Revoke" variant="text" color="error" size="small"
                                onClick={() => handleRevoke(perm.uid)} disabled={saving}
                              />
                            )
                          ) : (
                            canCreate && (
                              <Button
                                label="Assign" variant="text" color="primary" size="small"
                                onClick={() => handleAssign(perm.uid)} disabled={saving}
                              />
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
