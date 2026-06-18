import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI } from '../../services';

export default function PatientHistory() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  const history = appointments?.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED') || [];

  return (
    <DashboardLayout role="PATIENT">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No appointment history</p>
        ) : (
          history.map((appt) => (
            <div key={appt.id} className="flex justify-between items-center p-6 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium">{appt.doctorName}</p>
                <p className="text-sm text-gray-500">{appt.appointmentDate} • {appt.startTime}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {appt.status}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
