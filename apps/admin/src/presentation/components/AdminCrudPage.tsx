import { useState, useCallback } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions, PermissionGate } from "@rajkumarganesan93/auth";
import { useCrudList, useCrudMutations } from "../hooks/useAdminCrud";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "email" | "number" | "select" | "date" | "textarea";
  required?: boolean;
  showInTable?: boolean;
  showInForm?: boolean;
  options?: { value: string; label: string }[];
  render?: (value: any, item: any) => React.ReactNode;
}

interface AdminCrudPageProps {
  title: string;
  module: string;
  endpoints: {
    LIST: string;
    DETAIL: (uid: string) => string;
    CREATE: string;
    UPDATE: (uid: string) => string;
    DELETE: (uid: string) => string;
  };
  fields: FieldConfig[];
  searchPlaceholder?: string;
}

type FormMode = "closed" | "create" | "edit";

export default function AdminCrudPage({
  title,
  module,
  endpoints,
  fields,
  searchPlaceholder = "Search...",
}: AdminCrudPageProps) {
  const { items, meta, loading, refetch, goToPage, handleSearch } =
    useCrudList<any>(endpoints);
  const { saving, createItem, updateItem, deleteItem } =
    useCrudMutations(endpoints);
  const { can } = usePermissions();

  const canCreate = can("create", module);
  const canUpdate = can("update", module);
  const canDelete = can("delete", module);

  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [deleteConfirmUid, setDeleteConfirmUid] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const tableFields = fields.filter((f) => f.showInTable !== false);
  const formFields = fields.filter((f) => f.showInForm !== false);

  const resetForm = () => {
    const empty: Record<string, any> = {};
    formFields.forEach((f) => (empty[f.key] = ""));
    return empty;
  };

  const openCreate = () => {
    setFormData(resetForm());
    setEditingUid(null);
    setFormMode("create");
  };

  const openEdit = (item: any) => {
    const data: Record<string, any> = {};
    formFields.forEach((f) => (data[f.key] = item[f.key] ?? ""));
    setFormData(data);
    setEditingUid(item.uid);
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode("closed");
    setFormData(resetForm());
    setEditingUid(null);
  };

  const handleSubmit = async () => {
    const payload: Record<string, any> = {};
    formFields.forEach((f) => {
      const val = formData[f.key];
      if (val !== "" && val !== undefined && val !== null) {
        payload[f.key] = f.type === "number" ? Number(val) : val;
      }
    });

    let success = false;
    if (formMode === "create") {
      success = await createItem(payload);
    } else if (editingUid) {
      success = await updateItem(editingUid, payload);
    }
    if (success) {
      closeForm();
      refetch();
    }
  };

  const handleDelete = async (uid: string) => {
    if (await deleteItem(uid)) {
      setDeleteConfirmUid(null);
      refetch();
    }
  };

  const formatValue = useCallback((field: FieldConfig, value: any, item: any) => {
    if (field.render) return field.render(value, item);
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (field.type === "date" && value) {
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return String(value);
      }
    }
    return String(value);
  }, []);

  const isSubmitDisabled = () => {
    if (saving) return true;
    return formFields.some((f) => f.required && !formData[f.key]?.toString().trim());
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {canCreate && (
          <Button
            label={`Create`}
            variant="contained"
            color="primary"
            onClick={openCreate}
            disabled={formMode !== "closed"}
          />
        )}
      </div>

      {formMode !== "closed" && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? `Create ${title}` : `Edit ${title}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {formFields.map((field) => {
              if (field.type === "select" && field.options) {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      {field.label} {field.required && <span className="text-error">*</span>}
                    </label>
                    <select
                      value={formData[field.key] ?? ""}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-grey-300 rounded-lg text-sm bg-bg-paper text-text-primary"
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return (
                <TextField
                  key={field.key}
                  id={`field-${field.key}`}
                  label={field.label}
                  type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
                  value={formData[field.key] ?? ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                  fullWidth
                />
              );
            })}
          </div>
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={closeForm} />
            <Button
              label={saving ? "Saving..." : formMode === "create" ? "Create" : "Update"}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <TextField
            id="crud-search"
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchInput)}
            fullWidth
          />
        </div>
        <Button
          label="Search"
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleSearch(searchInput)}
        />
        {searchInput && (
          <Button
            label="Clear"
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => {
              setSearchInput("");
              handleSearch("");
            }}
          />
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-text-secondary">Loading...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                {tableFields.map((f) => (
                  <th
                    key={f.key}
                    className="px-4 py-3 text-sm font-semibold text-text-primary"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableFields.length + 1}
                    className="px-4 py-8 text-center text-text-secondary"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.uid}
                    className="border-t border-grey-300 hover:bg-action-hover"
                  >
                    {tableFields.map((f) => (
                      <td
                        key={f.key}
                        className="px-4 py-3 text-sm text-text-primary"
                      >
                        {formatValue(f, item[f.key], item)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      {deleteConfirmUid === item.uid ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-error">Delete?</span>
                          <Button
                            label="Yes"
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(item.uid)}
                            disabled={saving}
                          />
                          <Button
                            label="No"
                            variant="text"
                            color="secondary"
                            size="small"
                            onClick={() => setDeleteConfirmUid(null)}
                          />
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {canUpdate && (
                            <Button
                              label="Edit"
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => openEdit(item)}
                              disabled={formMode !== "closed"}
                            />
                          )}
                          {canDelete && (
                            <Button
                              label="Delete"
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => setDeleteConfirmUid(item.uid)}
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-text-secondary">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </span>
          <div className="flex gap-2">
            <Button
              label="Previous"
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => goToPage(meta.page - 1)}
              disabled={meta.page <= 1}
            />
            <Button
              label="Next"
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => goToPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
