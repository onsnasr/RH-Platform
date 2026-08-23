import DashboardLayout from '../../components/DashboardLayout';

const mockLogs = [
  { id: 1, user: 'admin@company.com', action: 'Created HR account', target: 'sarah@company.com', time: '2025-06-23 14:02' },
  { id: 2, user: 'admin@company.com', action: 'Logged in', target: '-', time: '2025-06-23 13:55' },
  { id: 3, user: 'hr@company.com', action: 'Added employee', target: 'John Doe', time: '2025-06-23 11:30' },
];

const AuditLogs = () => {
  return (
    <DashboardLayout title="Audit Logs" subtitle="Track all system activity">
      <div className="bg-yellow-50 text-yellow-700 text-sm rounded p-3 mb-4">
        Showing sample data — audit logging is not yet wired up to the backend.
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">Target</th>
              <th className="px-6 py-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{log.user}</td>
                <td className="px-6 py-4 text-gray-700">{log.action}</td>
                <td className="px-6 py-4 text-gray-500">{log.target}</td>
                <td className="px-6 py-4 text-gray-400">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
