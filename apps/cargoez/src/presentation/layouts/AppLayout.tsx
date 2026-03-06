import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "grid" },
  { label: "Contacts", path: "/contacts", icon: "users" },
  { label: "Freight", path: "/freight", icon: "truck" },
  { label: "Books", path: "/books", icon: "book" },
  { label: "UI Demo", path: "/ui-demo", icon: "palette" },
];

const iconMap: Record<string, string> = {
  grid: "📊",
  users: "👥",
  truck: "🚚",
  book: "📒",
  palette: "🎨",
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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
          {navItems.map((item) => (
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
          ))}
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
            <span className="text-sm text-text-secondary">Welcome, User</span>
            <Button label="Logout" variant="text" color="error" size="small" onClick={() => navigate("/")} />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
