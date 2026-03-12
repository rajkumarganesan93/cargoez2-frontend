import { useState, useEffect } from "react";
import { api } from "@rajkumarganesan93/uifunctions";
import { useAuth } from "@rajkumarganesan93/auth";

interface DashboardStats {
  tenants: number;
  branches: number;
  appCustomers: number;
  sysAdmins: number;
  branchCustomers: number;
  products: number;
}

const statCards: { key: keyof DashboardStats; label: string }[] = [
  { key: "tenants", label: "Tenants" },
  { key: "branches", label: "Branches" },
  { key: "appCustomers", label: "App Customers" },
  { key: "sysAdmins", label: "Sys Admins" },
  { key: "branchCustomers", label: "Branch Customers" },
  { key: "products", label: "Products" },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: DashboardStats }>("/admin-service/dashboard/stats");
        if (!cancelled) setStats(res.data.data);
      } catch {
        // leave stats null
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-text-secondary">Loading stats...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div key={card.key} className="bg-bg-paper rounded-lg p-5 border border-grey-300">
              <p className="text-sm text-text-secondary mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-text-primary">{stats[card.key]}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-paper rounded-lg p-6 border border-grey-300 text-center">
          <p className="text-text-secondary">Unable to load dashboard statistics.</p>
        </div>
      )}
    </div>
  );
}
