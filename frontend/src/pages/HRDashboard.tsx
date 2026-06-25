import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">HR Platform</h1>
          <p className="text-blue-300 text-sm mt-1">HR Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 rounded bg-blue-800 text-white">Dashboard</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-blue-200 hover:bg-blue-800">Employees</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-blue-200 hover:bg-blue-800">Departments</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-blue-200 hover:bg-blue-800">Leave Requests</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-blue-200 hover:bg-blue-800">Payroll</a>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-800 rounded text-left">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">HR Dashboard</h2>
        <p className="text-gray-500 mb-6">Manage your organization</p>

        {/* Stats */}
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

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Leave Requests</h3>
          <p className="text-gray-400 text-sm">No pending leave requests.</p>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;