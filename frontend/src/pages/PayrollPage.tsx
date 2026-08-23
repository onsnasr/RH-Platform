import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { payrollService, employeeService } from '../services/api';

interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

const emptyForm = { employeeId: '', month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()), baseSalary: '', bonus: '0', deductions: '0' };

const netSalary = (p: Payroll) => p.baseSalary + p.bonus - p.deductions;

const PayrollPage = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'SuperAdmin' || user?.role === 'HR';

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      if (isManager) {
        const [payrollRes, empRes] = await Promise.all([payrollService.getAll(), employeeService.getAll()]);
        setPayrolls(payrollRes.data);
        setEmployees(empRes.data);
      } else {
        const res = await payrollService.getByEmployee(user!.employeeId);
        setPayrolls(res.data);
      }
    } catch {
      setError('Could not load payroll data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- load on mount only
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await payrollService.generate({
        employeeId: form.employeeId,
        month: Number(form.month),
        year: Number(form.year),
        baseSalary: Number(form.baseSalary) || 0,
        bonus: Number(form.bonus) || 0,
        deductions: Number(form.deductions) || 0,
      });
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch {
      setError('Could not generate the payslip.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this payslip?')) return;
    try {
      await payrollService.delete(id);
      setPayrolls((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Could not delete the payslip.');
    }
  };

  const employeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  return (
    <DashboardLayout title="Payroll" subtitle={isManager ? 'Generate and review employee payslips' : 'Your payslips'}>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      {isManager && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowForm((v) => !v)} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
            {showForm ? 'Cancel' : '+ Generate Payslip'}
          </button>
        </div>
      )}

      {isManager && showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm col-span-2">
            <option value="">Select employee</option>
            {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>)}
          </select>
          <input required type="number" min="1" max="12" placeholder="Month (1-12)" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input required type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input required type="number" min="0" step="0.01" placeholder="Base Salary" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="number" step="0.01" placeholder="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <input type="number" step="0.01" placeholder="Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} className="border border-gray-300 rounded px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="col-span-2 bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50">
            {saving ? 'Generating...' : 'Generate Payslip'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm">Loading payroll data...</p>
        ) : payrolls.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No payslips yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {isManager && <th className="px-6 py-3 text-left">Employee</th>}
                <th className="px-6 py-3 text-left">Period</th>
                <th className="px-6 py-3 text-left">Base</th>
                <th className="px-6 py-3 text-left">Bonus</th>
                <th className="px-6 py-3 text-left">Deductions</th>
                <th className="px-6 py-3 text-left">Net</th>
                {isManager && <th className="px-6 py-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payrolls.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  {isManager && <td className="px-6 py-4 text-gray-700">{employeeName(p.employeeId)}</td>}
                  <td className="px-6 py-4 text-gray-500">{p.month}/{p.year}</td>
                  <td className="px-6 py-4 text-gray-500">{p.baseSalary}</td>
                  <td className="px-6 py-4 text-gray-500">{p.bonus}</td>
                  <td className="px-6 py-4 text-gray-500">{p.deductions}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">{netSalary(p)}</td>
                  {isManager && (
                    <td className="px-6 py-4">
                      {user?.role === 'SuperAdmin' && (
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
