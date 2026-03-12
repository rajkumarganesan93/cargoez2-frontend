import AdminCrudPage from "../components/AdminCrudPage";
import { METADATA_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function MetadataManagement() {
  return <AdminCrudPage title="Metadata" module="metadata" endpoints={METADATA_ENDPOINTS} fields={fields} searchPlaceholder="Search metadata..." />;
}
