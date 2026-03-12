import AdminCrudPage from "../components/AdminCrudPage";
import { SYS_ADMIN_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" as const, required: true },
  { key: "keycloakSub", label: "Keycloak Sub", showInTable: false },
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function SysAdminManagement() {
  return <AdminCrudPage title="Sys Admins" module="sys-admins" endpoints={SYS_ADMIN_ENDPOINTS} fields={fields} searchPlaceholder="Search sys admins..." />;
}
