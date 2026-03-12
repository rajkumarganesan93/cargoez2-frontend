import { PermissionGate } from "@rajkumarganesan93/auth";

export default function RolesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Roles</h1>
        <PermissionGate module="roles" operation="create">
          <button className="px-4 py-2 bg-primary text-white rounded-lg">
            Create Role
          </button>
        </PermissionGate>
      </div>
      <div className="bg-bg-primary rounded-xl border border-border-primary p-8 text-center text-text-secondary">
        Role management - coming soon
      </div>
    </div>
  );
}
