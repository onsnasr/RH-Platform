import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { employeeService, departmentService, authService } from '../services/api';

interface Employee {
  id: string;
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

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', department: '', position: '',
  hireDate: '', salary: '', isActive: true,
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [loginTargetId, setLoginTargetId] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([employeeService.getAll(), departmentService.getAll()]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch {
      setError('Could not load employees. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setForm({
      firstName: emp.firstName, lastName: emp.lastName, email: emp.email, phone: emp.phone,
      department: emp.department, position: emp.position,
      hireDate: emp.hireDate ? emp.hireDate.slice(0, 10) : '',
      salary: String(emp.salary), isActive: emp.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      department: form.department,
      position: form.position,
      hireDate: form.hireDate ? new Date(form.hireDate).toISOString() : new Date().toISOString(),
      salary: Number(form.salary) || 0,
      isActive: form.isActive,
    };
    try {
      if (editingId) await employeeService.update(editingId, payload);
      else await employeeService.create(payload);
      setShowForm(false);
      await load();
    } catch {
      setError('Could not save the employee.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this employee? This cannot be undone.')) return;
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Could not delete the employee.');
    }
  };

  const handleCreateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginTargetId) return;
    setLoginError('');
    setLoginMessage('');
    try {
      await authService.register({
        employeeId: loginTargetId,
        username: loginForm.username,
        password: loginForm.password,
        role: 2,
      });
      setLoginMessage('Login credentials created.');
      setLoginForm({ username: '', password: '' });
    } catch (err) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setLoginError(typeof msg === 'string' ? msg : 'Could not create login.');
    }
  };

  return (
    <DashboardLayout title="Employees" subtitle="View and manage employee records">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
          + Add Employee
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <input required placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input required placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="">Select department</option>
            {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <input placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="number" min="0" step="0.01" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
          <div className="col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Create Employee'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No employees yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Position</th>
                <th className="px-6 py-3 text-left">Salary</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.department || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.position || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{emp.salary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(emp)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => { setLoginTargetId(emp.id); setLoginMessage(''); setLoginError(''); }} className="text-purple-600 hover:underline text-xs">Create Login</button>
                    {isSuperAdmin && (
                      <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {loginTargetId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-10">
          <form onSubmit={handleCreateLogin} className="bg-white rounded-lg shadow p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Create Employee Login</h3>
            <input required placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            <input required type="password" placeholder="Password (min 6 characters)" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            {loginMessage && <p className="text-green-600 text-sm">{loginMessage}</p>}
            <div className="flex gap-3">
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">Create</button>
              <button type="button" onClick={() => setLoginTargetId(null)} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100">Close</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeesPage;
