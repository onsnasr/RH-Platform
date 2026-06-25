import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/admin-dashboard' },
  { label: 'Manage HR Accounts', path: '/admin/manage-hr' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'System Settings', path: '/admin/settings' },
];

const SystemSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [companyName, setCompanyName] = useState('My Company');
  const [emailNotifs, setEmailNotifs] = useState(true);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-1">System Settings</h2>
        <p className="text-gray-500 mb-6">Configure your platform</p>
        <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-xs text-gray-400">Send alerts for key actions</p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-12 h-6 rounded-full transition-colors ${emailNotifs ? 'bg-gray-800' : 'bg-gray-300'}`}>
              <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform mx-0.5 ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;