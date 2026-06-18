import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI } from '../../services';

export default function PatientAppointments() {
  const queryClient = useQueryClient();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentAPI.getAll().then((r) => r.data.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => appointmentAPI.cancel(id),
    onSuccess: () => queryClient.invalidateQueries(['my-appointments']),
  });

  if (isLoading) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    IN_QUEUE: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <DashboardLayout role="PATIENT">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">My Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Doctor', 'Date', 'Time', 'Token', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appt) => (
                <tr key={appt.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{appt.doctorName}</p>
                    <p className="text-xs text-gray-500">{appt.specialization}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{appt.appointmentDate}</td>
                  <td className="px-6 py-4 text-sm">{appt.startTime} - {appt.endTime}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{appt.queueToken}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {(appt.status === 'SCHEDULED' || appt.status === 'IN_QUEUE') && (
                      <button
                        onClick={() => cancelMutation.mutate(appt.id)}
                        className="text-danger text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments?.length === 0 && (
            <p className="text-center text-gray-500 py-12">No appointments found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
