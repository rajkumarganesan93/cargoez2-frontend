import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions } from "@rajkumarganesan93/auth";
import { useOperationList, useOperationMutation } from "../hooks/useOperations";

interface OperationFormData {
  code: string;
  name: string;
  description: string;
}

const emptyForm: OperationFormData = { code: "", name: "", description: "" };

export default function OperationManagement() {
  const { operations, loading, refetch } = useOperationList();
  const { saving, createOperation } = useOperationMutation();
  const { can } = usePermissions();
  const canCreate = can("create", "user-management", "permissions");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OperationFormData>(emptyForm);

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim()) return;
    const success = await createOperation({
      code: formData.code.trim(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });
    if (success) { setShowForm(false); setFormData(emptyForm); refetch(); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Operation Management</h1>
        {canCreate && <Button label="Create Operation" variant="contained" color="primary" onClick={() => setShowForm(true)} disabled={showForm} />}
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Create New Operation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <TextField id="op-code" label="Code" value={formData.code}
              onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. approve" fullWidth />
            <TextField id="op-name" label="Name" value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField id="op-desc" label="Description" value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} fullWidth />
          </div>
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={() => { setShowForm(false); setFormData(emptyForm); }} />
            <Button label={saving ? "Saving..." : "Create"} variant="contained" color="primary" onClick={handleSubmit}
              disabled={saving || !formData.code.trim() || !formData.name.trim()} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><span className="text-text-secondary">Loading operations...</span></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Code</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {operations.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-text-secondary">No operations found.</td></tr>
              ) : operations.map((op) => (
                <tr key={op.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary font-mono">{op.code}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{op.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{op.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
