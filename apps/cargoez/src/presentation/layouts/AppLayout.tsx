import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { useAuth, usePermissions } from "@rajkumarganesan93/auth";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  module: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "grid", module: "" },
  { label: "Contacts", path: "/contacts", icon: "users", module: "contacts" },
  { label: "Freight", path: "/freight", icon: "truck", module: "freight" },
  { label: "Books", path: "/books", icon: "book", module: "books" },
];

const iconMap: Record<string, string> = {
  grid: "📊",
  users: "👥",
  truck: "🚚",
  book: "📒",
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userName, logout } = useAuth();
  const { can, loading } = usePermissions();

  const isVisible = (module: string) => {
    if (!module) return true;
    return can("read", module);
  };

  return (
    <div className="flex min-h-screen bg-bg-default">
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } bg-primary transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center border-b border-primary-dark">
          <span className="text-primary-contrast font-bold text-xl">
            {sidebarOpen ? "CargoEz" : "C"}
          </span>
        </div>
        <nav className="flex-1 p-2 space-y-1 mt-2">
          {loading ? (
            <div className="text-primary-contrast/50 text-sm px-3 py-2">Loading...</div>
          ) : (
            navItems
              .filter((item) => isVisible(item.module))
              .map((item) => (
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
                  <span className="text-lg">{iconMap[item.icon] || "📄"}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </NavLink>
              ))
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-bg-paper border-b border-grey-300 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-text-primary hover:text-primary transition-colors cursor-pointer"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{userName ?? "User"}</span>
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
