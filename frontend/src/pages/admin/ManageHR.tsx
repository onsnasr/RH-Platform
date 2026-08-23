import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { authService } from '../../services/api';

const ManageHR = () => {
  const [form, setForm] = useState({ employeeId: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await authService.register({
        employeeId: form.employeeId,
        username: form.username,
        password: form.password,
        role: 1, // 1 = HR
      });
      setSuccess('HR account created successfully!');
      setForm({ employeeId: '', username: '', password: '' });
    } catch (err) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setError(typeof msg === 'string' ? msg : 'Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Manage HR Accounts" subtitle="Create HR staff accounts">
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
    </DashboardLayout>
  );
};

export default ManageHR;
