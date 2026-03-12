import AdminCrudPage from "../components/AdminCrudPage";
import { MODULE_ENDPOINTS, OPERATION_ENDPOINTS } from "../../infrastructure/endpoints/adminEndpoints";
import { useState } from "react";

const moduleFields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "icon", label: "Icon" },
  { key: "sortOrder", label: "Sort Order", type: "number" as const },
];

const operationFields = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
];

export default function MasterCatalogPage() {
  const [tab, setTab] = useState<"modules" | "operations">("modules");

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("modules")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "modules"
              ? "bg-primary text-primary-contrast"
              : "bg-bg-paper text-text-secondary border border-grey-300 hover:bg-grey-100"
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setTab("operations")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "operations"
              ? "bg-primary text-primary-contrast"
              : "bg-bg-paper text-text-secondary border border-grey-300 hover:bg-grey-100"
          }`}
        >
          Operations
        </button>
      </div>

      {tab === "modules" ? (
        <AdminCrudPage
          title="Modules"
          module="master-catalog"
          endpoints={MODULE_ENDPOINTS}
          fields={moduleFields}
          searchPlaceholder="Search modules..."
        />
      ) : (
        <AdminCrudPage
          title="Operations"
          module="master-catalog"
          endpoints={OPERATION_ENDPOINTS}
          fields={operationFields}
          searchPlaceholder="Search operations..."
        />
      )}
    </div>
  );
}
