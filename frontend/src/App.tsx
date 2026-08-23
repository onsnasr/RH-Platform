import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-store';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import PayrollPage from './pages/PayrollPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import ManageHR from './pages/admin/ManageHR';
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

          {/* Super Admin */}
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
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <DepartmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/leave-requests" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <LeaveRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/payroll" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <PayrollPage />
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

          {/* HR */}
          <Route path="/hr-dashboard" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/employees" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/hr/departments" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <DepartmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/hr/leave-requests" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <LeaveRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/hr/payroll" element={
            <ProtectedRoute allowedRoles={['HR', 'SuperAdmin']}>
              <PayrollPage />
            </ProtectedRoute>
          } />

          {/* Employee */}
          <Route path="/employee-dashboard" element={
            <ProtectedRoute allowedRoles={['Employee', 'HR', 'SuperAdmin']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/profile" element={
            <ProtectedRoute allowedRoles={['Employee', 'HR', 'SuperAdmin']}>
              <EmployeeProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/employee/leave-requests" element={
            <ProtectedRoute allowedRoles={['Employee', 'HR', 'SuperAdmin']}>
              <LeaveRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/employee/payslips" element={
            <ProtectedRoute allowedRoles={['Employee', 'HR', 'SuperAdmin']}>
              <PayrollPage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
