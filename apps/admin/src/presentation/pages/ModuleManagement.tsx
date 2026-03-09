import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions } from "@rajkumarganesan93/auth";
import { useModuleList, useModuleMutation } from "../hooks/useModules";
import type { AppModule } from "../../domain";

type FormMode = "closed" | "create" | "edit";

interface ModuleFormData {
  code: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: ModuleFormData = { code: "", name: "", description: "", icon: "", sortOrder: "", isActive: true };

export default function ModuleManagement() {
  const { modules, loading, refetch } = useModuleList();
  const { saving, createModule, updateModule, deleteModule } = useModuleMutation();
  const { can } = usePermissions();
  const canCreate = can("create", "user-management", "permissions");
  const canUpdate = can("update", "user-management", "permissions");
  const canDelete = can("delete", "user-management", "permissions");

  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<ModuleFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreate = () => { setFormData(emptyForm); setEditingId(null); setFormMode("create"); };
  const openEdit = (m: AppModule) => {
    setFormData({
      code: m.code, name: m.name, description: m.description ?? "",
      icon: m.icon ?? "", sortOrder: String(m.sortOrder), isActive: m.isActive,
    });
    setEditingId(m.id); setFormMode("edit");
  };
  const closeForm = () => { setFormMode("closed"); setFormData(emptyForm); setEditingId(null); };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    let success = false;
    if (formMode === "create") {
      if (!formData.code.trim()) return;
      success = await createModule({
        code: formData.code.trim(), name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
      });
    } else if (editingId) {
      success = await updateModule(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
        isActive: formData.isActive,
      });
    }
    if (success) { closeForm(); refetch(); }
  };

  const handleDelete = async (id: string) => {
    if (await deleteModule(id)) { setDeleteConfirmId(null); refetch(); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Module Management</h1>
        {canCreate && <Button label="Create Module" variant="contained" color="primary" onClick={openCreate} disabled={formMode !== "closed"} />}
      </div>

      {formMode !== "closed" && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? "Create New Module" : "Edit Module"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {formMode === "create" && (
              <TextField id="mod-code" label="Code" value={formData.code}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. user-management" fullWidth />
            )}
            <TextField id="mod-name" label="Name" value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField id="mod-desc" label="Description" value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} fullWidth />
            <TextField id="mod-icon" label="Icon" value={formData.icon}
              onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))} placeholder="icon name" fullWidth />
            <TextField id="mod-sort" label="Sort Order" type="number" value={formData.sortOrder}
              onChange={(e) => setFormData((p) => ({ ...p, sortOrder: e.target.value }))} fullWidth />
          </div>
          {formMode === "edit" && (
            <label className="flex items-center gap-2 mb-4 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
              Active
            </label>
          )}
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={closeForm} />
            <Button label={saving ? "Saving..." : formMode === "create" ? "Create" : "Update"}
              variant="contained" color="primary" onClick={handleSubmit}
              disabled={saving || !formData.name.trim() || (formMode === "create" && !formData.code.trim())} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading modules...</span></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Sort</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Code</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Icon</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Active</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-secondary">No modules found.</td></tr>
              ) : modules.map((m) => (
                <tr key={m.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-secondary">{m.sortOrder}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-mono">{m.code}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{m.icon ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${m.isActive ? "bg-success" : "bg-grey-400"}`} />
                  </td>
                  <td className="px-4 py-3">
                    {deleteConfirmId === m.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-error">Delete?</span>
                        <Button label="Yes" variant="contained" color="error" size="small" onClick={() => handleDelete(m.id)} disabled={saving} />
                        <Button label="No" variant="text" color="secondary" size="small" onClick={() => setDeleteConfirmId(null)} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {canUpdate && <Button label="Edit" variant="text" color="primary" size="small" onClick={() => openEdit(m)} disabled={formMode !== "closed"} />}
                        {canDelete && <Button label="Delete" variant="text" color="error" size="small" onClick={() => setDeleteConfirmId(m.id)} />}
                      </div>
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
