import { useState, useEffect } from "react";
import { Button } from "@rajkumarganesan93/uicontrols";
import { usePermissions as usePermissionContext } from "@rajkumarganesan93/auth";
import { useRoleList } from "../hooks/useRoles";
import { usePermissionList } from "../hooks/usePermissions";
import { useRolePermissionList, useRolePermissionMutation, useMyPermissions } from "../hooks/useRolePermissions";
import type { AbacConditions } from "../../domain";

type Tab = "manage" | "my-permissions";

export default function RolePermissionManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("manage");
  const { roles } = useRoleList(1, 50);
  const { permissions } = usePermissionList();
  const { rolePermissions, loading, fetchByRole } = useRolePermissionList();
  const { saving, assignPermission, revokePermission } = useRolePermissionMutation();
  const { myPermissions, loading: myLoading, fetchMyPermissions } = useMyPermissions();
  const { can } = usePermissionContext();
  const canAssign = can("create", "user-management", "permissions");
  const canRevoke = can("delete", "user-management", "permissions");

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignPermId, setAssignPermId] = useState("");
  const [tenantIsolation, setTenantIsolation] = useState(true);
  const [ownershipOnly, setOwnershipOnly] = useState(false);
  const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRoleId) fetchByRole(selectedRoleId);
  }, [selectedRoleId, fetchByRole]);

  useEffect(() => {
    if (activeTab === "my-permissions") fetchMyPermissions();
  }, [activeTab, fetchMyPermissions]);

  const assignedPermIds = new Set(rolePermissions.map((rp) => rp.permissionId));
  const availablePermissions = permissions.filter((p) => !assignedPermIds.has(p.id));

  const handleAssign = async () => {
    if (!selectedRoleId || !assignPermId) return;
    const conditions: AbacConditions = {};
    if (tenantIsolation) conditions.tenant_isolation = true;
    if (ownershipOnly) conditions.ownership_only = true;
    const success = await assignPermission(selectedRoleId, {
      permissionId: assignPermId,
      conditions: Object.keys(conditions).length > 0 ? conditions : null,
    });
    if (success) {
      setShowAssignForm(false);
      setAssignPermId("");
      setTenantIsolation(true);
      setOwnershipOnly(false);
      fetchByRole(selectedRoleId);
    }
  };

  const handleRevoke = async (permissionId: string) => {
    if (!selectedRoleId) return;
    if (await revokePermission(selectedRoleId, permissionId)) {
      setRevokeConfirmId(null);
      fetchByRole(selectedRoleId);
    }
  };

  const selectClass = "w-full max-w-sm px-3 py-2 border border-grey-300 rounded-lg bg-bg-paper text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
      activeTab === t ? "bg-bg-paper text-primary border-b-2 border-primary" : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Role Permissions</h1>

      <div className="flex gap-1 mb-6 border-b border-grey-300">
        <button className={tabClass("manage")} onClick={() => setActiveTab("manage")}>Manage Assignments</button>
        <button className={tabClass("my-permissions")} onClick={() => setActiveTab("my-permissions")}>My Permissions</button>
      </div>

      {activeTab === "manage" && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-1">Select Role</label>
            <select value={selectedRoleId} onChange={(e) => { setSelectedRoleId(e.target.value); setShowAssignForm(false); }} className={selectClass}>
              <option value="">-- Select a role --</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {selectedRoleId && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">{rolePermissions.length} permission(s) assigned</span>
              {canAssign && <Button label="Assign Permission" variant="contained" color="primary" size="small"
                onClick={() => setShowAssignForm(true)} disabled={showAssignForm} />}
            </div>
          )}

          {showAssignForm && selectedRoleId && (
            <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Assign Permission</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">Permission</label>
                <select value={assignPermId} onChange={(e) => setAssignPermId(e.target.value)} className={selectClass.replace("max-w-sm", "max-w-full")}>
                  <option value="">-- Select a permission --</option>
                  {availablePermissions.map((p) => <option key={p.id} value={p.id}>{p.permissionKey}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-text-primary mb-2">ABAC Conditions</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" checked={tenantIsolation} onChange={(e) => setTenantIsolation(e.target.checked)} className="w-4 h-4 accent-primary" />
                    Tenant Isolation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" checked={ownershipOnly} onChange={(e) => setOwnershipOnly(e.target.checked)} className="w-4 h-4 accent-primary" />
                    Ownership Only
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button label="Cancel" variant="outlined" color="secondary" onClick={() => { setShowAssignForm(false); setAssignPermId(""); }} />
                <Button label={saving ? "Assigning..." : "Assign"} variant="contained" color="primary" onClick={handleAssign}
                  disabled={saving || !assignPermId} />
              </div>
            </div>
          )}

          {!selectedRoleId ? (
            <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Select a role to manage its permissions.</span></div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading...</span></div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-grey-300">
              <table className="w-full text-left">
                <thead className="bg-grey-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Permission Key</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Conditions</th>
                    <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rolePermissions.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-text-secondary">No permissions assigned to this role.</td></tr>
                  ) : rolePermissions.map((rp) => (
                    <tr key={rp.id} className="border-t border-grey-300 hover:bg-action-hover">
                      <td className="px-4 py-3 text-sm text-text-primary font-mono">{rp.permissionKey ?? rp.permissionId}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {rp.conditions ? (
                          <div className="flex flex-wrap gap-1">
                            {rp.conditions.tenant_isolation && <span className="inline-block px-2 py-0.5 bg-info/10 text-info rounded text-xs">tenant</span>}
                            {rp.conditions.ownership_only && <span className="inline-block px-2 py-0.5 bg-warning/10 text-warning rounded text-xs">owner</span>}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {revokeConfirmId === rp.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-error">Revoke?</span>
                            <Button label="Yes" variant="contained" color="error" size="small" onClick={() => handleRevoke(rp.permissionId)} disabled={saving} />
                            <Button label="No" variant="text" color="secondary" size="small" onClick={() => setRevokeConfirmId(null)} />
                          </div>
                        ) : canRevoke ? (
                          <Button label="Revoke" variant="text" color="error" size="small" onClick={() => setRevokeConfirmId(rp.id)} />
                        ) : (
                          <span className="text-xs text-text-secondary">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "my-permissions" && (
        <div>
          {myLoading ? (
            <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading your permissions...</span></div>
          ) : !myPermissions ? (
            <div className="flex items-center justify-center py-12"><span className="text-text-secondary">No permission data loaded.</span></div>
          ) : (
            <div>
              <div className="mb-4 p-3 bg-bg-paper rounded-lg border border-grey-300">
                <span className="text-sm font-medium text-text-primary">Your Roles: </span>
                <span className="text-sm text-text-secondary">{myPermissions.roles.join(", ")}</span>
              </div>
              <div className="space-y-4">
                {myPermissions.modules.map((mod) => (
                  <div key={mod.code} className="rounded-lg border border-grey-300 overflow-hidden">
                    <div className="px-4 py-3 bg-grey-100 flex items-center gap-2">
                      {mod.icon && <span className="text-lg">{mod.icon}</span>}
                      <span className="font-semibold text-text-primary">{mod.name}</span>
                      <span className="text-xs text-text-secondary font-mono">({mod.code})</span>
                    </div>
                    <div className="divide-y divide-grey-200">
                      {mod.screens.map((scr) => (
                        <div key={scr.code} className="px-4 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-text-primary">{scr.name}</span>
                            <span className="text-xs text-text-secondary font-mono">({scr.code})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {scr.operations.map((op) => (
                              <span key={op} className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{op}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
