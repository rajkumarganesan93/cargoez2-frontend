import AdminCrudPage from "../components/AdminCrudPage";
import { BRANCH_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "tenantUid", label: "Tenant UID", required: true, showInTable: false },
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function BranchManagement() {
  return <AdminCrudPage title="Branches" module="branches" endpoints={BRANCH_ENDPOINTS} fields={fields} searchPlaceholder="Search branches..." />;
}
