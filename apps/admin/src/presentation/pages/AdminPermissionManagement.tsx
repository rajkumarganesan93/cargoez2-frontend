import { useCrudList } from "../hooks/useAdminCrud";
import { ADMIN_PERMISSION_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";
import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";

export default function AdminPermissionManagement() {
  const { items, meta, loading, refetch, goToPage, handleSearch } =
    useCrudList<any>(ADMIN_PERMISSION_ENDPOINTS);
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Admin Permissions</h1>
        <span className="text-sm text-text-secondary">
          Permissions are auto-generated from modules and operations
        </span>
      </div>

      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <TextField
            id="perm-search"
            placeholder="Search by permission key..."
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
            onClick={() => { setSearchInput(""); handleSearch(""); }}
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
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Permission Key</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Module UID</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Operation UID</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-text-secondary">
                    No permissions found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.uid} className="border-t border-grey-300 hover:bg-action-hover">
                    <td className="px-4 py-3 text-sm text-text-primary font-mono">
                      {item.permission_key ?? item.permissionKey ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {item.module_uid ?? item.moduleUid ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {item.operation_uid ?? item.operationUid ?? "—"}
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
              label="Previous" variant="outlined" color="primary" size="small"
              onClick={() => goToPage(meta.page - 1)} disabled={meta.page <= 1}
            />
            <Button
              label="Next" variant="outlined" color="primary" size="small"
              onClick={() => goToPage(meta.page + 1)} disabled={meta.page >= meta.totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
