import { useState, useEffect, useCallback } from "react";
import { Button } from "@rajkumarganesan93/uicontrols";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";
import { useAuth, usePermissions } from "@rajkumarganesan93/auth";
import {
  SYS_ADMIN_ENDPOINTS,
  ADMIN_ROLE_ENDPOINTS,
  SYS_ADMIN_ROLE_ENDPOINTS,
} from "../../infrastructure/endpoints/adminEndpoints";

interface SysAdmin { uid: string; first_name: string; last_name: string; email: string; }
interface AdminRole { uid: string; code: string; name: string; }
interface SysAdminRole { uid: string; sys_admin_uid: string; admin_role_uid: string; }

export default function SysAdminRolePage() {
  const { token } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();
  const canCreate = can("create", "admin-access-control");
  const canDelete = can("delete", "admin-access-control");

  const [sysAdmins, setSysAdmins] = useState<SysAdmin[]>([]);
  const [allRoles, setAllRoles] = useState<AdminRole[]>([]);
  const [selectedAdminUid, setSelectedAdminUid] = useState<string>("");
  const [assignedRoles, setAssignedRoles] = useState<SysAdminRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [adminsRes, rolesRes] = await Promise.all([
          api.get<any>(SYS_ADMIN_ENDPOINTS.LIST, { params: { limit: 100 } }),
          api.get<any>(ADMIN_ROLE_ENDPOINTS.LIST, { params: { limit: 100 } }),
        ]);
        setSysAdmins(adminsRes.data.data?.data ?? []);
        setAllRoles(rolesRes.data.data?.data ?? []);
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || "Failed to load data");
      }
    })();
  }, [token, showToast]);

  const fetchAssigned = useCallback(async (adminUid: string) => {
    if (!adminUid) { setAssignedRoles([]); return; }
    setLoading(true);
    try {
      const res = await api.get<any>(SYS_ADMIN_ROLE_ENDPOINTS.BY_SYS_ADMIN(adminUid));
      setAssignedRoles(res.data.data ?? []);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to fetch assigned roles");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (selectedAdminUid) fetchAssigned(selectedAdminUid);
  }, [selectedAdminUid, fetchAssigned]);

  const assignedRoleUids = new Set(assignedRoles.map((ar) => ar.admin_role_uid));

  const handleAssign = async (roleUid: string) => {
    setSaving(true);
    try {
      await api.post(SYS_ADMIN_ROLE_ENDPOINTS.ASSIGN, {
        sysAdminUid: selectedAdminUid,
        adminRoleUid: roleUid,
      });
      showToast("success", "Role assigned");
      await fetchAssigned(selectedAdminUid);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (roleUid: string) => {
    const mapping = assignedRoles.find((ar) => ar.admin_role_uid === roleUid);
    if (!mapping) return;
    setSaving(true);
    try {
      await api.del(SYS_ADMIN_ROLE_ENDPOINTS.REVOKE(mapping.uid));
      showToast("success", "Role revoked");
      await fetchAssigned(selectedAdminUid);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to revoke role");
    } finally {
      setSaving(false);
    }
  };

  const selectedAdmin = sysAdmins.find((a) => a.uid === selectedAdminUid);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Sys Admin Role Assignments</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-1">Select Sys Admin</label>
        <select
          value={selectedAdminUid}
          onChange={(e) => setSelectedAdminUid(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-grey-300 rounded-lg text-sm bg-bg-paper text-text-primary"
        >
          <option value="">-- Select a sys admin --</option>
          {sysAdmins.map((a) => (
            <option key={a.uid} value={a.uid}>
              {a.first_name} {a.last_name} ({a.email})
            </option>
          ))}
        </select>
      </div>

      {selectedAdminUid && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Roles for: {selectedAdmin?.first_name} {selectedAdmin?.last_name}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {assignedRoles.length} of {allRoles.length} roles assigned
          </p>

          {loading ? (
            <div className="py-8 text-center text-text-secondary">Loading...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-grey-300">
              <table className="w-full text-left">
                <thead className="bg-grey-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Role Code</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Role Name</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoles.map((role) => {
                    const isAssigned = assignedRoleUids.has(role.uid);
                    return (
                      <tr key={role.uid} className="border-t border-grey-300 hover:bg-action-hover">
                        <td className="px-4 py-3 text-sm font-mono text-text-primary">{role.code}</td>
                        <td className="px-4 py-3 text-sm text-text-primary">{role.name}</td>
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
                                onClick={() => handleRevoke(role.uid)} disabled={saving}
                              />
                            )
                          ) : (
                            canCreate && (
                              <Button
                                label="Assign" variant="text" color="primary" size="small"
                                onClick={() => handleAssign(role.uid)} disabled={saving}
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
