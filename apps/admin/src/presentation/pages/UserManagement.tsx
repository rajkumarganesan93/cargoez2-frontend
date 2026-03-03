import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { useUserList, useUserMutation } from "../hooks/useAdmin";
import type { User } from "../../domain";

type FormMode = "closed" | "create" | "edit";

interface UserFormData {
  name: string;
  email: string;
}

const emptyForm: UserFormData = { name: "", email: "" };

export default function UserManagement() {
  const { users, meta, loading, refetch, goToPage, connected } = useUserList();
  const { saving, createUser, updateUser, deleteUser } = useUserMutation();

  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreateForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setFormMode("create");
  };

  const openEditForm = (user: User) => {
    setFormData({ name: user.name, email: user.email });
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

    let success = false;
    if (formMode === "create") {
      success = await createUser(formData);
    } else if (formMode === "edit" && editingId) {
      success = await updateUser(editingId, formData);
    }

    if (success) {
      closeForm();
      refetch(meta.page, meta.limit);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteUser(id);
    if (success) {
      setDeleteConfirmId(null);
      refetch(meta.page, meta.limit);
    }
  };

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
        <Button
          label="Create User"
          variant="contained"
          color="primary"
          onClick={openCreateForm}
          disabled={formMode !== "closed"}
        />
      </div>

      {/* Inline Form */}
      {formMode !== "closed" && (
        <div className="mb-6 p-4 bg-bg-paper rounded-lg border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {formMode === "create" ? "Create New User" : "Edit User"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      <div className="mb-4">
        <TextField
          id="user-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
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
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    {search ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-t border-grey-300 hover:bg-action-hover">
                    <td className="px-4 py-3 text-sm text-text-primary font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.isActive
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(user.createdAt)}
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
                          <Button
                            label="Edit"
                            variant="text"
                            color="primary"
                            size="small"
                            onClick={() => openEditForm(user)}
                            disabled={formMode !== "closed"}
                          />
                          <Button
                            label="Delete"
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() => setDeleteConfirmId(user.id)}
                          />
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
