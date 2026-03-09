import { useState, useEffect } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions } from "@rajkumarganesan93/auth";
import { useModuleList } from "../hooks/useModules";
import { useScreenList, useScreenMutation } from "../hooks/useScreens";
import type { Screen } from "../../domain";

type FormMode = "closed" | "create" | "edit";

interface ScreenFormData {
  code: string;
  name: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: ScreenFormData = { code: "", name: "", description: "", sortOrder: "", isActive: true };

export default function ScreenManagement() {
  const { modules, loading: modulesLoading } = useModuleList();
  const { screens, loading: screensLoading, fetchScreens } = useScreenList();
  const { saving, createScreen, updateScreen, deleteScreen } = useScreenMutation();
  const { can } = usePermissions();
  const canCreate = can("create", "user-management", "permissions");
  const canUpdate = can("update", "user-management", "permissions");
  const canDelete = can("delete", "user-management", "permissions");

  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<ScreenFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedModuleId) fetchScreens(selectedModuleId);
  }, [selectedModuleId, fetchScreens]);

  const openCreate = () => { setFormData(emptyForm); setEditingId(null); setFormMode("create"); };
  const openEdit = (s: Screen) => {
    setFormData({ code: s.code, name: s.name, description: s.description ?? "", sortOrder: String(s.sortOrder), isActive: s.isActive });
    setEditingId(s.id); setFormMode("edit");
  };
  const closeForm = () => { setFormMode("closed"); setFormData(emptyForm); setEditingId(null); };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    let success = false;
    if (formMode === "create") {
      if (!formData.code.trim() || !selectedModuleId) return;
      success = await createScreen({
        moduleId: selectedModuleId, code: formData.code.trim(), name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
      });
    } else if (editingId) {
      success = await updateScreen(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        sortOrder: formData.sortOrder ? Number(formData.sortOrder) : undefined,
        isActive: formData.isActive,
      });
    }
    if (success) { closeForm(); fetchScreens(selectedModuleId); }
  };

  const handleDelete = async (id: string) => {
    if (await deleteScreen(id)) { setDeleteConfirmId(null); fetchScreens(selectedModuleId); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Screen Management</h1>
        {canCreate && <Button label="Create Screen" variant="contained" color="primary" onClick={openCreate} disabled={formMode !== "closed" || !selectedModuleId} />}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-1">Select Module</label>
        <select
          value={selectedModuleId}
          onChange={(e) => { setSelectedModuleId(e.target.value); closeForm(); }}
          className="w-full max-w-sm px-3 py-2 border border-grey-300 rounded-lg bg-bg-paper text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={modulesLoading}
        >
          <option value="">-- Select a module --</option>
          {modules.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
        </select>
      </div>

      {formMode !== "closed" && selectedModuleId && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? "Create New Screen" : "Edit Screen"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {formMode === "create" && (
              <TextField id="scr-code" label="Code" value={formData.code}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. users" fullWidth />
            )}
            <TextField id="scr-name" label="Name" value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField id="scr-desc" label="Description" value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} fullWidth />
            <TextField id="scr-sort" label="Sort Order" type="number" value={formData.sortOrder}
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

      {!selectedModuleId ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Select a module to view its screens.</span></div>
      ) : screensLoading ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading screens...</span></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Sort</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Code</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Active</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {screens.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-text-secondary">No screens for this module.</td></tr>
              ) : screens.map((s) => (
                <tr key={s.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-secondary">{s.sortOrder}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-mono">{s.code}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full ${s.isActive ? "bg-success" : "bg-grey-400"}`} />
                  </td>
                  <td className="px-4 py-3">
                    {deleteConfirmId === s.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-error">Delete?</span>
                        <Button label="Yes" variant="contained" color="error" size="small" onClick={() => handleDelete(s.id)} disabled={saving} />
                        <Button label="No" variant="text" color="secondary" size="small" onClick={() => setDeleteConfirmId(null)} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {canUpdate && <Button label="Edit" variant="text" color="primary" size="small" onClick={() => openEdit(s)} disabled={formMode !== "closed"} />}
                        {canDelete && <Button label="Delete" variant="text" color="error" size="small" onClick={() => setDeleteConfirmId(s.id)} />}
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
