import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./presentation/layouts/AdminLayout";
import AdminDashboard from "./presentation/pages/AdminDashboard";
import UserManagement from "./presentation/pages/UserManagement";
import SystemSettings from "./presentation/pages/SystemSettings";
import RoleManagement from "./presentation/pages/RoleManagement";
import ModuleManagement from "./presentation/pages/ModuleManagement";
import ScreenManagement from "./presentation/pages/ScreenManagement";
import OperationManagement from "./presentation/pages/OperationManagement";
import PermissionManagement from "./presentation/pages/PermissionManagement";
import RolePermissionManagement from "./presentation/pages/RolePermissionManagement";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/modules" element={<ModuleManagement />} />
        <Route path="/screens" element={<ScreenManagement />} />
        <Route path="/operations" element={<OperationManagement />} />
        <Route path="/permissions" element={<PermissionManagement />} />
        <Route path="/role-permissions" element={<RolePermissionManagement />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}
