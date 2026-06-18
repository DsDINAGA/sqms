import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI } from '../../services';

export default function ManageAppointments() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['all-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="ADMIN"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="ADMIN">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Patient', 'Doctor', 'Date', 'Time', 'Token', 'Status'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appt) => (
              <tr key={appt.id} className="border-t border-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{appt.patientName}</td>
                <td className="px-6 py-4 text-sm">{appt.doctorName}</td>
                <td className="px-6 py-4 text-sm">{appt.appointmentDate}</td>
                <td className="px-6 py-4 text-sm">{appt.startTime}</td>
                <td className="px-6 py-4 font-mono text-sm">{appt.queueToken}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{appt.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
