import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "User Management", path: "/users", icon: "👤" },
  { label: "System Settings", path: "/settings", icon: "⚙️" },
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-bg-default">
      <aside className="w-60 bg-primary flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-primary-dark">
          <span className="text-primary-contrast font-bold text-xl">Admin Panel</span>
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
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-bg-paper border-b border-grey-300 flex items-center justify-between px-6">
          <span className="text-lg font-semibold text-text-primary">CargoEz Administration</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Admin</span>
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
