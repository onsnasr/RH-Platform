import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManageHR from './pages/admin/ManageHR';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageDepartments from './pages/admin/ManageDepartments';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user!.role)) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-hr" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <ManageHR />
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <ManageEmployees />
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <ManageDepartments />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SystemSettings />
            </ProtectedRoute>
          } />
          <Route path="/hr-dashboard" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee-dashboard" element={
            <ProtectedRoute allowedRoles={['Employee', 'HR', 'SuperAdmin']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;