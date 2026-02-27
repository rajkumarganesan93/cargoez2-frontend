import { timeAgo } from "@rajkumarganesan93/uifunctions";

const systemStats = [
  { label: "Total Users", value: "156" },
  { label: "Active Sessions", value: "42" },
  { label: "API Requests (24h)", value: "12,847" },
  { label: "System Uptime", value: "99.9%" },
];

const recentUsers = [
  { name: "admin", role: "admin", lastLogin: new Date(Date.now() - 300000) },
  { name: "testuser", role: "user", lastLogin: new Date(Date.now() - 3600000) },
  { name: "manager", role: "manager", lastLogin: new Date(Date.now() - 7200000) },
];

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {systemStats.map((stat) => (
          <div key={stat.label} className="bg-bg-paper rounded-lg p-5 border border-grey-300">
            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-bg-paper rounded-lg p-5 border border-grey-300">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent User Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Username</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Role</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.name} className="border-t border-grey-300">
                  <td className="px-4 py-3 text-sm text-text-primary">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{timeAgo(user.lastLogin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
