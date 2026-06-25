import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white flex flex-col">
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold">HR Platform</h1>
          <p className="text-green-300 text-sm mt-1">Employee</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 rounded bg-green-800 text-white">Dashboard</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-green-200 hover:bg-green-800">My Profile</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-green-200 hover:bg-green-800">My Payslips</a>
          <a href="#" className="flex items-center px-4 py-2 rounded text-green-200 hover:bg-green-800">Leave Requests</a>
        </nav>
        <div className="p-4 border-t border-green-800">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-green-200 hover:text-white hover:bg-green-800 rounded text-left">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Employee Dashboard</h2>
        <p className="text-gray-500 mb-6">Welcome back!</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Leave Balance</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-sm text-gray-500">Payslips Available</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
          </div>
        </div>

        {/* My Leave Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Leave Requests</h3>
          <p className="text-gray-400 text-sm">No leave requests yet.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;