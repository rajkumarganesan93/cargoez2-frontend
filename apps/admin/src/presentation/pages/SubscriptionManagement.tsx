import AdminCrudPage from "../components/AdminCrudPage";
import { SUBSCRIPTION_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";

const fields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "price", label: "Price", type: "number" as const },
  { key: "billingCycle", label: "Billing Cycle", type: "select" as const, options: [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ]},
  { key: "isActive", label: "Active", showInForm: false, render: (v: boolean) => v ? "Yes" : "No" },
];

export default function SubscriptionManagement() {
  return <AdminCrudPage title="Subscriptions" module="subscriptions" endpoints={SUBSCRIPTION_ENDPOINTS} fields={fields} searchPlaceholder="Search subscriptions..." />;
}
