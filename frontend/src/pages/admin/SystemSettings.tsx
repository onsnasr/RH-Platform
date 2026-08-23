import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const SystemSettings = () => {
  const [companyName, setCompanyName] = useState('My Company');
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <DashboardLayout title="System Settings" subtitle="Configure your platform">
      <div className="bg-yellow-50 text-yellow-700 text-sm rounded p-3 mb-4 max-w-lg">
        These settings are not yet persisted to the backend — changes will reset on reload.
      </div>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Email Notifications</p>
            <p className="text-xs text-gray-400">Send alerts for key actions</p>
          </div>
          <button
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`w-12 h-6 rounded-full transition-colors ${emailNotifs ? 'bg-gray-800' : 'bg-gray-300'}`}>
            <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform mx-0.5 ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
