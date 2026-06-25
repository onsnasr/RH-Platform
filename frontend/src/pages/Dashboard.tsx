import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = user?.role === '0' ? 'Super Admin' : user?.role === '1' ? 'HR' : 'Employee';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">HR Platform</h1>
          <p className="text-gray-400 text-sm mt-1">{roleLabel}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 rounded bg-gray-700 text-white">Dashboard</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-gray-300 hover:bg-gray-700">Employees</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-gray-300 hover:bg-gray-700">Departments</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-gray-300 hover:bg-gray-700">Leave Requests</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-gray-300 hover:bg-gray-700">Payroll</a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded text-left">
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {roleLabel}!</h2>
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Departments</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Pending Leaves</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Payrolls Generated</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;