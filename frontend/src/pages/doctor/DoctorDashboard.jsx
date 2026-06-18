import { useQuery } from '@tanstack/react-query';
import { People, CalendarMonth, Queue } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI } from '../../services';

export default function DoctorDashboard() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="DOCTOR"><LoadingSpinner /></DashboardLayout>;

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments?.filter((a) => a.appointmentDate === today) || [];
  const inQueue = todayAppts.filter((a) => a.status === 'IN_QUEUE');
  const completed = todayAppts.filter((a) => a.status === 'COMPLETED');

  return (
    <DashboardLayout role="DOCTOR">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Today's Appointments" value={todayAppts.length} icon={CalendarMonth} color="primary" />
        <StatCard title="In Queue" value={inQueue.length} icon={Queue} color="warning" />
        <StatCard title="Completed" value={completed.length} icon={People} color="success" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold mb-4">Today's Schedule</h2>
        {todayAppts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments today</p>
        ) : (
          todayAppts.map((appt) => (
            <div key={appt.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium">{appt.patientName}</p>
                <p className="text-sm text-gray-500">{appt.startTime} - {appt.endTime} • {appt.queueToken}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                appt.status === 'IN_QUEUE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
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
