import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI, queueAPI } from '../../services';

export default function QueueStatus() {
  const [selectedAppt, setSelectedAppt] = useState(null);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  const activeAppointments = appointments?.filter(
    (a) => a.status === 'IN_QUEUE' || a.status === 'SCHEDULED'
  ) || [];

  useEffect(() => {
    if (activeAppointments.length > 0 && !selectedAppt) {
      setSelectedAppt(activeAppointments[0]);
    }
  }, [activeAppointments, selectedAppt]);

  const { data: queueStatus, refetch } = useQuery({
    queryKey: ['queue-status', selectedAppt?.id],
    queryFn: () => queueAPI.getStatus(selectedAppt.id).then((r) => r.data.data),
    enabled: !!selectedAppt,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!selectedAppt?.doctorId) return;
    const ws = new WebSocket(`ws://localhost:8080/ws/queue?doctorId=${selectedAppt.doctorId}`);
    ws.onmessage = () => refetch();
    return () => ws.close();
  }, [selectedAppt?.doctorId, refetch]);

  if (isLoading) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  if (activeAppointments.length === 0) {
    return (
      <DashboardLayout role="PATIENT">
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No active queue entries</p>
          <p className="text-gray-400 text-sm mt-2">Book an appointment to get a queue token</p>
        </div>
      </DashboardLayout>
    );
  }

  const progress = queueStatus?.progressPercent || 0;

  return (
    <DashboardLayout role="PATIENT">
      {activeAppointments.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {activeAppointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setSelectedAppt(appt)}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                selectedAppt?.id === appt.id ? 'bg-primary text-white' : 'bg-white border border-gray-200'
              }`}
            >
              {appt.queueToken}
            </button>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Queue Status</p>
          <p className="text-4xl font-extrabold text-primary mt-1">{queueStatus?.yourToken}</p>
          <p className="text-gray-500 text-sm mt-1">Dr. {queueStatus?.doctorName}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center bg-blue-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">{queueStatus?.currentServing || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Now Serving</p>
          </div>
          <div className="text-center bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-warning">{queueStatus?.patientsAhead || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Ahead of You</p>
          </div>
          <div className="text-center bg-teal-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-secondary">{queueStatus?.estimatedWaitingMinutes || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Minutes Wait</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">Auto-refreshes every 5 seconds • Live WebSocket updates</p>
      </motion.div>
    </DashboardLayout>
  );
}
