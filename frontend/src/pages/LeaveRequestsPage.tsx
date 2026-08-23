import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { leaveService } from '../services/api';

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number | string;
  approvedBy: string;
}

const STATUS: Record<string, { label: string; classes: string }> = {
  '0': { label: 'Pending', classes: 'bg-yellow-100 text-yellow-700' },
  '1': { label: 'Approved', classes: 'bg-green-100 text-green-700' },
  '2': { label: 'Rejected', classes: 'bg-red-100 text-red-700' },
};

const LeaveRequestsPage = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'SuperAdmin' || user?.role === 'HR';

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = isManager ? await leaveService.getAll() : await leaveService.getByEmployee(user!.employeeId);
      setRequests(res.data);
    } catch {
      setError('Could not load leave requests. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- load on mount only
  useEffect(() => { load(); }, []);

  const handleDecision = async (id: string, approve: boolean) => {
    setError('');
    try {
      if (approve) await leaveService.approve(id);
      else await leaveService.reject(id);
      await load();
    } catch {
      setError('Could not update the leave request.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this leave request?')) return;
    try {
      await leaveService.delete(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Could not delete the leave request.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employeeId) {
      setError('Your account has no linked employee record yet. Contact HR.');
      return;
    }
    setSubmitting(true);
    setSubmitMessage('');
    setError('');
    try {
      await leaveService.submit({
        employeeId: user.employeeId,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        reason: form.reason,
      });
      setSubmitMessage('Leave request submitted.');
      setForm({ startDate: '', endDate: '', reason: '' });
      await load();
    } catch {
      setError('Could not submit the leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Leave Requests" subtitle={isManager ? 'Review and decide on employee leave requests' : 'Submit and track your leave requests'}>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      {!isManager && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 max-w-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Request Leave</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          {submitMessage && <p className="text-green-600 text-sm">{submitMessage}</p>}
          <button type="submit" disabled={submitting} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm">Loading leave requests...</p>
        ) : requests.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No leave requests yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {isManager && <th className="px-6 py-3 text-left">Employee</th>}
                <th className="px-6 py-3 text-left">Dates</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((r) => {
                const status = STATUS[String(r.status)] ?? STATUS['0'];
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    {isManager && <td className="px-6 py-4 text-gray-700">{r.employeeId}</td>}
                    <td className="px-6 py-4 text-gray-500">{r.startDate?.slice(0, 10)} → {r.endDate?.slice(0, 10)}</td>
                    <td className="px-6 py-4 text-gray-500">{r.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${status.classes}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {isManager && String(r.status) === '0' && (
                        <>
                          <button onClick={() => handleDecision(r.id, true)} className="text-green-600 hover:underline text-xs">Approve</button>
                          <button onClick={() => handleDecision(r.id, false)} className="text-red-600 hover:underline text-xs">Reject</button>
                        </>
                      )}
                      {user?.role === 'SuperAdmin' && (
                        <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequestsPage;
