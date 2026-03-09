import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions } from "@rajkumarganesan93/auth";
import { useRoleList, useRoleMutation } from "../hooks/useRoles";
import type { Role } from "../../domain";

type FormMode = "closed" | "create" | "edit";

interface RoleFormData {
  name: string;
  description: string;
  isActive: boolean;
}

const emptyForm: RoleFormData = { name: "", description: "", isActive: true };

export default function RoleManagement() {
  const { roles, meta, loading, search, refetch, goToPage, handleSearch } = useRoleList();
  const { saving, createRole, updateRole, deleteRole } = useRoleMutation();
  const { can } = usePermissions();
  const canCreate = can("create", "user-management", "roles");
  const canUpdate = can("update", "user-management", "roles");
  const canDelete = can("delete", "user-management", "roles");

  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<RoleFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  const openCreate = () => { setFormData(emptyForm); setEditingId(null); setFormMode("create"); };
  const openEdit = (role: Role) => {
    setFormData({ name: role.name, description: role.description ?? "", isActive: role.isActive });
    setEditingId(role.id); setFormMode("edit");
  };
  const closeForm = () => { setFormMode("closed"); setFormData(emptyForm); setEditingId(null); };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    let success = false;
    if (formMode === "create") {
      success = await createRole({ name: formData.name.trim(), description: formData.description.trim() || undefined });
    } else if (editingId) {
      success = await updateRole(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      });
    }
    if (success) { closeForm(); refetch(); }
  };

  const handleDelete = async (id: string) => {
    if (await deleteRole(id)) { setDeleteConfirmId(null); refetch(); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Role Management</h1>
        {canCreate && <Button label="Create Role" variant="contained" color="primary" onClick={openCreate} disabled={formMode !== "closed"} />}
      </div>

      {formMode !== "closed" && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? "Create New Role" : "Edit Role"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField id="role-name" label="Name" value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField id="role-desc" label="Description" value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} fullWidth />
          </div>
          {formMode === "edit" && (
            <label className="flex items-center gap-2 mb-4 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 accent-primary" />
              Active
            </label>
          )}
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={closeForm} />
            <Button label={saving ? "Saving..." : formMode === "create" ? "Create" : "Update"}
              variant="contained" color="primary" onClick={handleSubmit}
              disabled={saving || !formData.name.trim()} />
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <TextField id="role-search" placeholder="Search roles..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)} fullWidth />
        </div>
        <Button label="Search" variant="contained" color="primary" size="small" onClick={() => handleSearch(searchInput)} />
        {searchInput && <Button label="Clear" variant="outlined" color="secondary" size="small" onClick={() => { setSearchInput(""); handleSearch(""); }} />}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading roles...</span></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Description</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">System</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Active</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-text-secondary">No roles found.</td></tr>
              ) : roles.map((role) => (
                <tr key={role.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{role.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{role.description ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{role.isSystem ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${role.isActive ? "bg-success" : "bg-grey-400"}`} />
                  </td>
                  <td className="px-4 py-3">
                    {deleteConfirmId === role.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-error">Delete?</span>
                        <Button label="Yes" variant="contained" color="error" size="small" onClick={() => handleDelete(role.id)} disabled={saving} />
                        <Button label="No" variant="text" color="secondary" size="small" onClick={() => setDeleteConfirmId(null)} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {canUpdate && <Button label="Edit" variant="text" color="primary" size="small" onClick={() => openEdit(role)} disabled={formMode !== "closed" || role.isSystem} />}
                        {canDelete && <Button label="Delete" variant="text" color="error" size="small" onClick={() => setDeleteConfirmId(role.id)} disabled={role.isSystem} />}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-text-secondary">Page {meta.page} of {meta.totalPages} ({meta.total} total)</span>
          <div className="flex gap-2">
            <Button label="Previous" variant="outlined" color="primary" size="small" onClick={() => goToPage(meta.page - 1)} disabled={meta.page <= 1} />
            <Button label="Next" variant="outlined" color="primary" size="small" onClick={() => goToPage(meta.page + 1)} disabled={meta.page >= meta.totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}
