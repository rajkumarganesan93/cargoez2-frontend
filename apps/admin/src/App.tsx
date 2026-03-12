import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./presentation/layouts/AdminLayout";
import AdminDashboard from "./presentation/pages/AdminDashboard";
import TenantManagement from "./presentation/pages/TenantManagement";
import BranchManagement from "./presentation/pages/BranchManagement";
import AppCustomerManagement from "./presentation/pages/AppCustomerManagement";
import BranchCustomerManagement from "./presentation/pages/BranchCustomerManagement";
import SysAdminManagement from "./presentation/pages/SysAdminManagement";
import MetadataManagement from "./presentation/pages/MetadataManagement";
import MasterCatalogPage from "./presentation/pages/MasterCatalogPage";
import ProductManagement from "./presentation/pages/ProductManagement";
import SubscriptionManagement from "./presentation/pages/SubscriptionManagement";
import AdminRoleManagement from "./presentation/pages/AdminRoleManagement";
import AdminPermissionManagement from "./presentation/pages/AdminPermissionManagement";
import AdminRolePermissionPage from "./presentation/pages/AdminRolePermissionPage";
import SysAdminRolePage from "./presentation/pages/SysAdminRolePage";
import SystemSettings from "./presentation/pages/SystemSettings";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/tenants" element={<TenantManagement />} />
        <Route path="/branches" element={<BranchManagement />} />
        <Route path="/app-customers" element={<AppCustomerManagement />} />
        <Route path="/branch-customers" element={<BranchCustomerManagement />} />
        <Route path="/sys-admins" element={<SysAdminManagement />} />
        <Route path="/metadata" element={<MetadataManagement />} />
        <Route path="/master-catalog" element={<MasterCatalogPage />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/subscriptions" element={<SubscriptionManagement />} />
        <Route path="/admin-roles" element={<AdminRoleManagement />} />
        <Route path="/admin-permissions" element={<AdminPermissionManagement />} />
        <Route path="/admin-role-permissions" element={<AdminRolePermissionPage />} />
        <Route path="/sys-admin-roles" element={<SysAdminRolePage />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}
