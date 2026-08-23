import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { employeeService } from '../services/api';

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  isActive: boolean;
}

const EmployeeProfilePage = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.employeeId) {
      setLoading(false);
      setError('Your account has no linked employee record yet. Contact HR.');
      return;
    }
    employeeService.getById(user.employeeId)
      .then((res) => setEmployee(res.data))
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false));
  }, [user?.employeeId]);

  return (
    <DashboardLayout title="My Profile" subtitle="Your employee record">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : employee ? (
        <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="text-gray-800 font-medium">{employee.firstName} {employee.lastName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-800">{employee.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-800">{employee.phone || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Department</span><span className="text-gray-800">{employee.department || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Position</span><span className="text-gray-800">{employee.position || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Hire Date</span><span className="text-gray-800">{employee.hireDate?.slice(0, 10) || '—'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-gray-800">{employee.isActive ? 'Active' : 'Inactive'}</span></div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default EmployeeProfilePage;
