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

const ManageHR = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ employeeId: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('http://localhost:5263/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: form.employeeId,
          username: form.username,
          password: form.password,
          role: 1 // 1 = HR
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Something went wrong');
      } else {
        setSuccess('HR account created successfully!');
        setForm({ employeeId: '', username: '', password: '' });
      }
    } catch (err) {
      setError('Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">StaffFlow</h1>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Manage HR Accounts</h2>
        <p className="text-gray-500 mb-6">Create HR staff accounts</p>

        <div className="bg-white rounded-lg shadow p-6 max-w-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New HR Account</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                placeholder="e.g. EMP001"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. sarah.hr"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !form.employeeId || !form.username || !form.password}
              className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating...' : 'Create HR Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHR;