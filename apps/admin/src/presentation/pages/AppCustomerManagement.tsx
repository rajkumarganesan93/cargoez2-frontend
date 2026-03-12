import AdminCrudPage from "../components/AdminCrudPage";
import { APP_CUSTOMER_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" as const, required: true },
  { key: "tenantUid", label: "Tenant UID", required: true, showInTable: false },
  { key: "branchUid", label: "Branch UID", showInTable: false },
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function AppCustomerManagement() {
  return <AdminCrudPage title="App Customers" module="app-customers" endpoints={APP_CUSTOMER_ENDPOINTS} fields={fields} searchPlaceholder="Search customers..." />;
}
