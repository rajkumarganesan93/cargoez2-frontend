import { useState, useEffect, useCallback } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions as usePermissionContext } from "@rajkumarganesan93/auth";
import { usePermissionList, usePermissionMutation } from "../hooks/usePermissions";
import { useModuleList } from "../hooks/useModules";
import { useScreenList } from "../hooks/useScreens";
import { useOperationList } from "../hooks/useOperations";

interface PermissionFormData {
  moduleId: string;
  screenId: string;
  operationId: string;
}

const emptyForm: PermissionFormData = { moduleId: "", screenId: "", operationId: "" };

export default function PermissionManagement() {
  const { permissions, loading, search, refetch, handleSearch } = usePermissionList();
  const { saving, createPermission, deletePermission } = usePermissionMutation();
  const { modules } = useModuleList();
  const { screens, fetchScreens } = useScreenList();
  const { operations } = useOperationList();
  const { can } = usePermissionContext();
  const canCreate = can("create", "user-management", "permissions");
  const canDelete = can("delete", "user-management", "permissions");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PermissionFormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    if (formData.moduleId) fetchScreens(formData.moduleId);
  }, [formData.moduleId, fetchScreens]);

  const onModuleChange = useCallback((moduleId: string) => {
    setFormData((p) => ({ ...p, moduleId, screenId: "" }));
  }, []);

  const handleSubmit = async () => {
    if (!formData.moduleId || !formData.screenId || !formData.operationId) return;
    const success = await createPermission({
      moduleId: formData.moduleId,
      screenId: formData.screenId,
      operationId: formData.operationId,
    });
    if (success) { setShowForm(false); setFormData(emptyForm); refetch(); }
  };

  const handleDelete = async (id: string) => {
    if (await deletePermission(id)) { setDeleteConfirmId(null); refetch(); }
  };

  const selectClass = "w-full px-3 py-2 border border-grey-300 rounded-lg bg-bg-paper text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Permission Management</h1>
        {canCreate && <Button label="Create Permission" variant="contained" color="primary" onClick={() => setShowForm(true)} disabled={showForm} />}
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Create New Permission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Module</label>
              <select value={formData.moduleId} onChange={(e) => onModuleChange(e.target.value)} className={selectClass}>
                <option value="">-- Select Module --</option>
                {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Screen</label>
              <select value={formData.screenId}
                onChange={(e) => setFormData((p) => ({ ...p, screenId: e.target.value }))}
                className={selectClass} disabled={!formData.moduleId}>
                <option value="">-- Select Screen --</option>
                {screens.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Operation</label>
              <select value={formData.operationId}
                onChange={(e) => setFormData((p) => ({ ...p, operationId: e.target.value }))}
                className={selectClass}>
                <option value="">-- Select Operation --</option>
                {operations.map((op) => <option key={op.id} value={op.id}>{op.name} ({op.code})</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={() => { setShowForm(false); setFormData(emptyForm); }} />
            <Button label={saving ? "Saving..." : "Create"} variant="contained" color="primary" onClick={handleSubmit}
              disabled={saving || !formData.moduleId || !formData.screenId || !formData.operationId} />
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <TextField id="perm-search" placeholder="Search by permission key..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)} fullWidth />
        </div>
        <Button label="Search" variant="contained" color="primary" size="small" onClick={() => handleSearch(searchInput)} />
        {searchInput && <Button label="Clear" variant="outlined" color="secondary" size="small" onClick={() => { setSearchInput(""); handleSearch(""); }} />}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading permissions...</span></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Permission Key</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-text-secondary">No permissions found.</td></tr>
              ) : permissions.map((p) => (
                <tr key={p.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary font-mono">{p.permissionKey}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    {deleteConfirmId === p.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-error">Delete?</span>
                        <Button label="Yes" variant="contained" color="error" size="small" onClick={() => handleDelete(p.id)} disabled={saving} />
                        <Button label="No" variant="text" color="secondary" size="small" onClick={() => setDeleteConfirmId(null)} />
                      </div>
                    ) : canDelete ? (
                      <Button label="Delete" variant="text" color="error" size="small" onClick={() => setDeleteConfirmId(p.id)} />
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
    </div>
  );
}
