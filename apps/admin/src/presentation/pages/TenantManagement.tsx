import AdminCrudPage from "../components/AdminCrudPage";
import { TENANT_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "dbStrategy", label: "DB Strategy", type: "select" as const, options: [
    { value: "shared", label: "Shared" },
    { value: "dedicated", label: "Dedicated" },
  ]},
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function TenantManagement() {
  return <AdminCrudPage title="Tenants" module="tenants" endpoints={TENANT_ENDPOINTS} fields={fields} searchPlaceholder="Search tenants..." />;
}
