import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { People, LocalHospital, CalendarMonth, CheckCircle, Queue } from '@mui/icons-material';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard().then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="ADMIN"><LoadingSpinner /></DashboardLayout>;

  const dailyChart = {
    labels: stats?.dailyPatients?.map((d) => d.date?.slice(5)) || [],
    datasets: [{
      label: 'Patients',
      data: stats?.dailyPatients?.map((d) => d.count) || [],
      backgroundColor: '#2563EB',
      borderRadius: 8,
    }],
  };

  const weeklyChart = {
    labels: stats?.weeklyAppointments?.map((d) => d.day) || [],
    datasets: [{
      label: 'Appointments',
      data: stats?.weeklyAppointments?.map((d) => d.count) || [],
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const doctorChart = {
    labels: stats?.doctorPerformance?.map((d) => d.name?.replace('Dr. ', '')) || [],
    datasets: [{
      label: 'Today\'s Appointments',
      data: stats?.doctorPerformance?.map((d) => d.appointments) || [],
      backgroundColor: ['#2563EB', '#14B8A6', '#8B5CF6', '#F59E0B'],
      borderRadius: 8,
    }],
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Patients" value={stats?.totalPatients || 0} icon={People} color="primary" />
        <StatCard title="Total Doctors" value={stats?.totalDoctors || 0} icon={LocalHospital} color="secondary" />
        <StatCard title="Today's Appointments" value={stats?.todayAppointments || 0} icon={CalendarMonth} color="accent" />
        <StatCard title="Completed" value={stats?.completedAppointments || 0} icon={CheckCircle} color="success" />
        <StatCard title="Active Queues" value={stats?.activeQueues || 0} icon={Queue} color="warning" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Daily Patients</h3>
          <Bar data={dailyChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold mb-4">Weekly Appointments</h3>
          <Line data={weeklyChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
          <h3 className="font-semibold mb-4">Doctor Performance (Today)</h3>
          <Bar data={doctorChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </DashboardLayout>
  );
}
