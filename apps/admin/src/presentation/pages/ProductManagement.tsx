import AdminCrudPage from "../components/AdminCrudPage";
import { PRODUCT_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function ProductManagement() {
  return <AdminCrudPage title="Products" module="products" endpoints={PRODUCT_ENDPOINTS} fields={fields} searchPlaceholder="Search products..." />;
}
