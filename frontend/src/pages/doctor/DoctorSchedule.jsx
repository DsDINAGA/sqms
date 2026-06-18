import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI } from '../../services';

export default function DoctorSchedule() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="DOCTOR"><LoadingSpinner /></DashboardLayout>;

  const upcoming = appointments?.filter((a) => a.status !== 'CANCELLED') || [];

  return (
    <DashboardLayout role="DOCTOR">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Patient', 'Date', 'Time', 'Token', 'Status'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upcoming.map((appt) => (
              <tr key={appt.id} className="border-t border-gray-50">
                <td className="px-6 py-4 font-medium">{appt.patientName}</td>
                <td className="px-6 py-4 text-sm">{appt.appointmentDate}</td>
                <td className="px-6 py-4 text-sm">{appt.startTime} - {appt.endTime}</td>
                <td className="px-6 py-4 font-mono text-sm">{appt.queueToken}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
