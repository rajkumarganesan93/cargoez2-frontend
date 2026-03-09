import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { useAuth } from "@rajkumarganesan93/auth";

interface NavSection {
  title?: string;
  items: { label: string; path: string; icon: string }[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "\u{1F4CA}" },
      { label: "User Management", path: "/users", icon: "\u{1F464}" },
    ],
  },
  {
    title: "Authorization",
    items: [
      { label: "Roles", path: "/roles", icon: "\u{1F6E1}" },
      { label: "Modules", path: "/modules", icon: "\u{1F4E6}" },
      { label: "Screens", path: "/screens", icon: "\u{1F5A5}" },
      { label: "Operations", path: "/operations", icon: "\u{2699}" },
      { label: "Permissions", path: "/permissions", icon: "\u{1F511}" },
      { label: "Role Permissions", path: "/role-permissions", icon: "\u{1F512}" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "System Settings", path: "/settings", icon: "\u{2699}\u{FE0F}" },
    ],
  },
];

export function AdminLayout() {
  const { userName, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-bg-default">
      <aside className="w-60 bg-primary flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-primary-dark">
          <span className="text-primary-contrast font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="flex-1 p-2 mt-2 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={si} className={si > 0 ? "mt-4" : ""}>
              {section.title && (
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-contrast/50">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
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
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
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
