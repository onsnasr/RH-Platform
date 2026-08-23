import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-store';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  SuperAdmin: [
    { label: 'Dashboard', path: '/admin-dashboard' },
    { label: 'Manage HR Accounts', path: '/admin/manage-hr' },
    { label: 'Employees', path: '/admin/employees' },
    { label: 'Departments', path: '/admin/departments' },
    { label: 'Leave Requests', path: '/admin/leave-requests' },
    { label: 'Payroll', path: '/admin/payroll' },
    { label: 'Audit Logs', path: '/admin/audit-logs' },
    { label: 'System Settings', path: '/admin/settings' },
  ],
  HR: [
    { label: 'Dashboard', path: '/hr-dashboard' },
    { label: 'Employees', path: '/hr/employees' },
    { label: 'Departments', path: '/hr/departments' },
    { label: 'Leave Requests', path: '/hr/leave-requests' },
    { label: 'Payroll', path: '/hr/payroll' },
  ],
  Employee: [
    { label: 'Dashboard', path: '/employee-dashboard' },
    { label: 'My Profile', path: '/employee/profile' },
    { label: 'Leave Requests', path: '/employee/leave-requests' },
    { label: 'My Payslips', path: '/employee/payslips' },
  ],
};

const THEME: Record<string, { bg: string; border: string; text: string; activeItem: string; inactiveItem: string; logout: string }> = {
  SuperAdmin: {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-300',
    activeItem: 'bg-gray-700 text-white',
    inactiveItem: 'text-gray-300 hover:bg-gray-700',
    logout: 'text-gray-300 hover:text-white hover:bg-gray-700',
  },
  HR: {
    bg: 'bg-blue-900',
    border: 'border-blue-800',
    text: 'text-blue-200',
    activeItem: 'bg-blue-800 text-white',
    inactiveItem: 'text-blue-200 hover:bg-blue-800',
    logout: 'text-blue-200 hover:text-white hover:bg-blue-800',
  },
  Employee: {
    bg: 'bg-green-900',
    border: 'border-green-800',
    text: 'text-green-200',
    activeItem: 'bg-green-800 text-white',
    inactiveItem: 'text-green-200 hover:bg-green-800',
    logout: 'text-green-200 hover:text-white hover:bg-green-800',
  },
};

const ROLE_LABEL: Record<string, string> = {
  SuperAdmin: 'Super Admin',
  HR: 'HR Manager',
  Employee: 'Employee',
};

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, subtitle, children }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role ?? 'Employee';
  const items = NAV_ITEMS[role] ?? NAV_ITEMS.Employee;
  const theme = THEME[role] ?? THEME.Employee;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className={`w-64 ${theme.bg} text-white flex flex-col`}>
        <div className={`p-6 border-b ${theme.border}`}>
          <h1 className="text-xl font-bold">HR Platform</h1>
          <p className={`${theme.text} text-sm mt-1`}>{ROLE_LABEL[role]}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => (
            <a
              key={item.path}
              href="#"
              onClick={(e) => { e.preventDefault(); navigate(item.path); }}
              className={`flex items-center px-4 py-2 rounded ${location.pathname === item.path ? theme.activeItem : theme.inactiveItem}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className={`p-4 border-t ${theme.border}`}>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className={`w-full px-4 py-2 text-sm rounded text-left ${theme.logout}`}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
