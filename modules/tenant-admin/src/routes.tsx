import { Routes, Route, Navigate } from "react-router-dom";
import { PermissionGate } from "@rajkumarganesan93/auth";
import RolesPage from "./presentation/pages/RolesPage";
import PermissionsPage from "./presentation/pages/PermissionsPage";
import UserRolesPage from "./presentation/pages/UserRolesPage";
import BranchesPage from "./presentation/pages/BranchesPage";

export default function TenantAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="roles" replace />} />
      <Route path="roles" element={<RolesPage />} />
      <Route path="permissions" element={<PermissionsPage />} />
      <Route path="user-roles" element={<UserRolesPage />} />
      <Route path="branches" element={<BranchesPage />} />
    </Routes>
  );
}
