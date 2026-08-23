import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { employeeService, departmentService, leaveService, payrollService } from '../services/api';

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number | string;
}

const HRDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [payrollCount, setPayrollCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const load = async () => {
    try {
      const [employeesRes, departmentsRes, leavesRes, payrollRes] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        leaveService.getAll(),
        payrollService.getAll(),
      ]);
      setEmployeeCount(employeesRes.data.length);
      setDepartmentCount(departmentsRes.data.length);
      setPendingLeaves(leavesRes.data.filter((l: LeaveRequest) => String(l.status) === '0'));
      setPayrollCount(payrollRes.data.length);
    } catch {
      setError('Could not load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (id: string, approve: boolean) => {
    setActionError('');
    try {
      if (approve) await leaveService.approve(id);
      else await leaveService.reject(id);
      setPendingLeaves((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setActionError('Could not update the leave request.');
    }
  };

  return (
    <DashboardLayout title="HR Dashboard" subtitle="Manage your organization">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          ['Total Employees', loading ? '—' : employeeCount],
          ['Departments', loading ? '—' : departmentCount],
          ['Pending Leaves', loading ? '—' : pendingLeaves.length],
          ['Payrolls Generated', loading ? '—' : payrollCount],
        ].map(([label, val]) => (
          <div key={label} className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{val}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Leave Requests</h3>
        {actionError && <p className="text-red-500 text-sm mb-3">{actionError}</p>}
        {pendingLeaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No pending leave requests.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pendingLeaves.map((l) => (
              <li key={l.id} className="py-3 text-sm text-gray-700 flex items-center justify-between gap-4">
                <span className="flex-1">Employee {l.employeeId} — {l.reason}</span>
                <span className="text-gray-400">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</span>
                <div className="space-x-2">
                  <button onClick={() => handleDecision(l.id, true)} className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700">Approve</button>
                  <button onClick={() => handleDecision(l.id, false)} className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700">Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HRDashboard;
