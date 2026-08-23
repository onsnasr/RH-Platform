import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { leaveService, payrollService } from '../services/api';

interface LeaveRequest {
  id: string;
  status: number | string;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payslipCount, setPayslipCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.employeeId) {
      setLoading(false);
      setError('Your account has no linked employee record yet. Contact HR.');
      return;
    }
    const load = async () => {
      try {
        const [leavesRes, payrollRes] = await Promise.all([
          leaveService.getByEmployee(user.employeeId),
          payrollService.getByEmployee(user.employeeId),
        ]);
        setLeaves(leavesRes.data);
        setPayslipCount(payrollRes.data.length);
      } catch {
        setError('Could not load your data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.employeeId]);

  const pending = leaves.filter((l) => String(l.status) === '0').length;
  const approved = leaves.filter((l) => String(l.status) === '1').length;

  return (
    <DashboardLayout title="Employee Dashboard" subtitle="Welcome back!">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-500">Approved Leaves</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '—' : approved}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '—' : pending}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-500">Payslips Available</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '—' : payslipCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Leave Requests</h3>
        {leaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No leave requests yet.</p>
        ) : (
          <p className="text-gray-500 text-sm">{leaves.length} request(s) on file — see Leave Requests for details.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
