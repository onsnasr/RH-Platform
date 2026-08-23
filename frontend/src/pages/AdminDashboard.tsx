import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { employeeService, departmentService, leaveService } from '../services/api';

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number | string;
}

const STATUS_LABEL: Record<string, string> = { '0': 'Pending', '1': 'Approved', '2': 'Rejected' };

const AdminDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [employeesRes, departmentsRes, leavesRes] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          leaveService.getAll(),
        ]);
        setEmployeeCount(employeesRes.data.length);
        setDepartmentCount(departmentsRes.data.length);
        setPendingLeaves(leavesRes.data.filter((l: LeaveRequest) => String(l.status) === '0'));
      } catch {
        setError('Could not load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Full system overview">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          ['Total Employees', loading ? '—' : employeeCount],
          ['Departments', loading ? '—' : departmentCount],
          ['Pending Leaves', loading ? '—' : pendingLeaves.length],
        ].map(([label, val]) => (
          <div key={label} className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{val}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Leave Requests</h3>
        {pendingLeaves.length === 0 ? (
          <p className="text-gray-400 text-sm">No pending leave requests.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pendingLeaves.map((l) => (
              <li key={l.id} className="py-2 text-sm text-gray-700 flex justify-between">
                <span>Employee {l.employeeId}</span>
                <span className="text-gray-400">{l.startDate?.slice(0, 10)} → {l.endDate?.slice(0, 10)}</span>
                <span className="text-yellow-600">{STATUS_LABEL[String(l.status)] ?? 'Pending'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
