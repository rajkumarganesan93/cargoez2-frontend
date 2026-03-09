import { useState, useCallback } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { usePermissions } from "@rajkumarganesan93/auth";
import { useUserList, useUserMutation } from "../hooks/useAdmin";
import type { User } from "../../domain";

type FormMode = "closed" | "create" | "edit";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

const emptyForm: UserFormData = { name: "", email: "", phone: "" };

export default function UserManagement() {
  const { users, meta, loading, search, refetch, goToPage, handleSearch, connected } = useUserList();
  const { saving, createUser, updateUser, deleteUser } = useUserMutation();
  const { can } = usePermissions();
  const canCreate = can("create", "user-management", "users");
  const canUpdate = can("update", "user-management", "users");
  const canDelete = can("delete", "user-management", "users");

  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  const openCreateForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormMode("create");
  };

  const openEditForm = (user: User) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone ?? "" });
    setEditingId(user.id);
    setFormMode("edit");
  };

  const closeForm = () => {
    setFormMode("closed");
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
    };

    let success = false;
    if (formMode === "create") {
      success = await createUser(payload);
    } else if (formMode === "edit" && editingId) {
      success = await updateUser(editingId, payload);
    }

    if (success) {
      closeForm();
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteUser(id);
    if (success) {
      setDeleteConfirmId(null);
      refetch();
    }
  };

  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const onSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchInput);
    }
  }, [handleSearch, searchInput]);

  const onSearchClear = useCallback(() => {
    setSearchInput("");
    handleSearch("");
  }, [handleSearch]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
              connected
                ? "bg-success/10 text-success"
                : "bg-grey-300/30 text-text-secondary"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-grey-400"}`} />
            {connected ? "Live" : "Offline"}
          </span>
        </div>
        {canCreate && (
          <Button
            label="Create User"
            variant="contained"
            color="primary"
            onClick={openCreateForm}
            disabled={formMode !== "closed"}
          />
        )}
      </div>

      {/* Inline Form */}
      {formMode !== "closed" && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? "Create New User" : "Edit User"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <TextField
              id="user-name"
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              id="user-email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            <TextField
              id="user-phone"
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+1234567890"
              fullWidth
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button label="Cancel" variant="outlined" color="secondary" onClick={closeForm} />
            <Button
              label={saving ? "Saving..." : formMode === "create" ? "Create" : "Update"}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={saving || !formData.name.trim() || !formData.email.trim()}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <TextField
            id="user-search"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onSearchKeyDown}
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
            onClick={onSearchClear}
          />
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-text-secondary">Loading users...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Modified</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                    {search ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-grey-300 hover:bg-action-hover">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(user.modifiedAt)}
                    </td>
                    <td className="px-4 py-3">
                      {deleteConfirmId === user.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-error">Delete?</span>
                          <Button
                            label="Yes"
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            disabled={saving}
                          />
                          <Button
                            label="No"
                            variant="text"
                            color="secondary"
                            size="small"
                            onClick={() => setDeleteConfirmId(null)}
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
                              onClick={() => openEditForm(user)}
                              disabled={formMode !== "closed"}
                            />
                          )}
                          {canDelete && (
                            <Button
                              label="Delete"
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => setDeleteConfirmId(user.id)}
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

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-text-secondary">
            Showing page {meta.page} of {meta.totalPages} ({meta.total} total users)
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
