import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

const sampleUsers: User[] = [
  { id: "1", username: "admin", email: "admin@cargoez.com", role: "admin", status: "Active" },
  { id: "2", username: "testuser", email: "testuser@cargoez.com", role: "user", status: "Active" },
  { id: "3", username: "manager", email: "manager@cargoez.com", role: "manager", status: "Active" },
];

export default function UserManagement() {
  const [users] = useState<User[]>(sampleUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await api.post("/api/users", { username: "newuser", email: "newuser@cargoez.com", role: "user" });
    } catch {
      alert("Sample create user action (API not connected)");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <Button label="Create User" variant="contained" color="primary" onClick={handleCreate} />
      </div>
      <div className="mb-4">
        <TextField
          id="user-search"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-grey-300">
        <table className="w-full text-left">
          <thead className="bg-grey-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Username</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Email</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Role</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-grey-300 hover:bg-action-hover">
                <td className="px-4 py-3 text-sm text-text-primary font-medium">{user.username}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                <td className="px-4 py-3 text-sm text-text-secondary capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button label="Edit" variant="text" color="primary" size="small" />
                    <Button label="Disable" variant="text" color="warning" size="small" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
