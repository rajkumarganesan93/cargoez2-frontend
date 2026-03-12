import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { useAuth, usePermissions } from "@rajkumarganesan93/auth";

interface NavItem {
  label: string;
  path: string;
  module: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const allNavSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", path: "/dashboard", module: "" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Tenants", path: "/tenants", module: "tenants" },
      { label: "Branches", path: "/branches", module: "branches" },
      { label: "App Customers", path: "/app-customers", module: "app-customers" },
      { label: "Branch Customers", path: "/branch-customers", module: "branch-customers" },
      { label: "Sys Admins", path: "/sys-admins", module: "sys-admins" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { label: "Metadata", path: "/metadata", module: "metadata" },
      { label: "Master Catalog", path: "/master-catalog", module: "master-catalog" },
      { label: "Products", path: "/products", module: "products" },
      { label: "Subscriptions", path: "/subscriptions", module: "subscriptions" },
    ],
  },
  {
    title: "Access Control",
    items: [
      { label: "Admin Roles", path: "/admin-roles", module: "admin-access-control" },
      { label: "Admin Permissions", path: "/admin-permissions", module: "admin-access-control" },
      { label: "Role Permissions", path: "/admin-role-permissions", module: "admin-access-control" },
      { label: "Sys Admin Roles", path: "/sys-admin-roles", module: "admin-access-control" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", path: "/settings", module: "" },
    ],
  },
];

export function AdminLayout() {
  const { userName, logout } = useAuth();
  const { can, loading } = usePermissions();

  const isVisible = (module: string) => {
    if (!module) return true;
    return can("read", module);
  };

  return (
    <div className="flex min-h-screen bg-bg-default">
      <aside className="w-60 bg-primary flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-primary-dark">
          <span className="text-primary-contrast font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="flex-1 p-2 mt-2 overflow-y-auto">
          {loading ? (
            <div className="text-primary-contrast/50 text-sm px-3 py-2">Loading...</div>
          ) : (
            allNavSections.map((section, si) => {
              const visibleItems = section.items.filter((item) => isVisible(item.module));
              if (visibleItems.length === 0) return null;
              return (
                <div key={si} className={si > 0 ? "mt-4" : ""}>
                  {section.title && (
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-contrast/50">
                      {section.title}
                    </div>
                  )}
                  <div className="space-y-1">
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary-dark text-primary-contrast"
                              : "text-primary-contrast/80 hover:bg-primary-dark/50 hover:text-primary-contrast"
                          }`
                        }
                      >
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-bg-paper border-b border-grey-300 flex items-center justify-between px-6">
          <span className="text-lg font-semibold text-text-primary">CargoEz Administration</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{userName ?? "Admin"}</span>
            <Button label="Logout" variant="text" color="error" size="small" onClick={() => logout()} />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
