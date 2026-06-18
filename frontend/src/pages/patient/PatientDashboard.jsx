import { useQuery } from '@tanstack/react-query';
import { CalendarMonth, Queue, AccessTime, Notifications } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI, notificationAPI } from '../../services';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationAPI.getAll().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  const upcoming = appointments?.filter((a) => a.status === 'SCHEDULED' || a.status === 'IN_QUEUE') || [];
  const activeAppt = upcoming[0];

  return (
    <DashboardLayout role="PATIENT">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Upcoming Appointments" value={upcoming.length} icon={CalendarMonth} color="primary" />
        <StatCard title="Queue Token" value={activeAppt?.queueToken || 'N/A'} icon={Queue} color="secondary" />
        <StatCard title="Waiting Time" value={activeAppt ? '~35 min' : 'N/A'} icon={AccessTime} color="warning" />
        <StatCard
          title="Notifications"
          value={notifications?.filter((n) => n.status === 'UNREAD').length || 0}
          icon={Notifications}
          color="accent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming appointments</p>
              <Link to="/patient/book" className="text-primary font-medium mt-2 inline-block hover:underline">
                Book an appointment
              </Link>
            </div>
          ) : (
            upcoming.slice(0, 3).map((appt) => (
              <div key={appt.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium">{appt.doctorName}</p>
                  <p className="text-sm text-gray-500">{appt.appointmentDate} at {appt.startTime}</p>
                </div>
                <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {appt.queueToken}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Notifications</h2>
          {notifications?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notifications</p>
          ) : (
            notifications?.slice(0, 5).map((n) => (
              <div key={n.id} className="py-3 border-b border-gray-50 last:border-0">
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
