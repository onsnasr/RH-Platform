import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/admin-dashboard' },
  { label: 'Manage HR Accounts', path: '/admin/manage-hr' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'System Settings', path: '/admin/settings' },
];

const ManageDepartments = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">HR Platform</h1>
          <p className="text-gray-400 text-sm mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.path} href="#"
              onClick={(e) => { e.preventDefault(); navigate(item.path); }}
              className={`flex items-center px-4 py-2 rounded ${location.pathname === item.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded text-left">Logout</button>
        </div>
      </div>
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Departments</h2>
        <p className="text-gray-500 mb-6">View and manage departments</p>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-400 text-sm">No departments yet. (API connection coming soon)</p>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;