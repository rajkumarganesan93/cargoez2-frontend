import AdminCrudPage from "../components/AdminCrudPage";
import type { FieldConfig } from "../components/AdminCrudPage";
import { ADMIN_ROLE_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields: FieldConfig[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "isActive", label: "Active", showInForm: false, render: (v) => (v ? "Yes" : "No") },
];

export default function AdminRoleManagement() {
  return (
    <AdminCrudPage
      title="Admin Roles"
      module="admin-access-control"
      endpoints={ADMIN_ROLE_ENDPOINTS}
      fields={fields}
      searchPlaceholder="Search roles..."
    />
  );
}
