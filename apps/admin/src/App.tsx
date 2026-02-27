import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./presentation/layouts/AdminLayout";
import AdminDashboard from "./presentation/pages/AdminDashboard";
import UserManagement from "./presentation/pages/UserManagement";
import SystemSettings from "./presentation/pages/SystemSettings";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}
