import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/auth-store';
import { departmentService, authService } from '../services/api';

interface Department {
  id: string;
  name: string;
  description: string;
  hrId: string;
}

interface UserOption {
  id: string;
  username: string;
  role: number | string;
}

const emptyForm = { name: '', description: '', hrId: '' };

const DepartmentsPage = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [deptRes, usersRes] = await Promise.all([departmentService.getAll(), authService.getUsers()]);
      setDepartments(deptRes.data);
      setUsers(usersRes.data.filter((u: UserOption) => String(u.role) === '0' || String(u.role) === '1'));
    } catch {
      setError('Could not load departments. Is the backend running?');
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

  const openEdit = (dept: Department) => {
    setEditingId(dept.id);
    setForm({ name: dept.name, description: dept.description, hrId: dept.hrId ?? '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) await departmentService.update(editingId, form);
      else await departmentService.create(form);
      setShowForm(false);
      await load();
    } catch {
      setError('Could not save the department.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await departmentService.delete(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError('Could not delete the department.');
    }
  };

  const hrName = (hrId: string) => users.find((u) => u.id === hrId)?.username ?? (hrId || '—');

  return (
    <DashboardLayout title="Departments" subtitle="View and manage departments">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
          + Add Department
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4 max-w-lg">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          <select value={form.hrId} onChange={(e) => setForm({ ...form, hrId: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="">No head assigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update Department' : 'Create Department'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm">Loading departments...</p>
        ) : departments.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No departments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Head</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{dept.name}</td>
                  <td className="px-6 py-4 text-gray-500">{dept.description || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{hrName(dept.hrId)}</td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(dept)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    {isSuperAdmin && (
                      <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DepartmentsPage;
