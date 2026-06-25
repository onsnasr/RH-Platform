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

const AuditLogs = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mockLogs = [
    { id: 1, user: 'admin@company.com', action: 'Created HR account', target: 'sarah@company.com', time: '2025-06-23 14:02' },
    { id: 2, user: 'admin@company.com', action: 'Logged in', target: '-', time: '2025-06-23 13:55' },
    { id: 3, user: 'hr@company.com', action: 'Added employee', target: 'John Doe', time: '2025-06-23 11:30' },
  ];

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
              onClick={(e) => { e.preventDefault(); if (item.path !== '#') navigate(item.path); }}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Audit Logs</h2>
        <p className="text-gray-500 mb-6">Track all system activity</p>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Target</th>
                <th className="px-6 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{log.user}</td>
                  <td className="px-6 py-4 text-gray-700">{log.action}</td>
                  <td className="px-6 py-4 text-gray-500">{log.target}</td>
                  <td className="px-6 py-4 text-gray-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;