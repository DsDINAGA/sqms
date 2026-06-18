import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { scheduleAPI, doctorAPI } from '../../services';

export default function ManageSchedules() {
  const [form, setForm] = useState({ doctorId: '', date: '', startTime: '', endTime: '' });
  const queryClient = useQueryClient();

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorAPI.getAll().then((r) => r.data.data),
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['all-schedules'],
    queryFn: () => scheduleAPI.getAll().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => scheduleAPI.create({ ...data, doctorId: Number(data.doctorId) }),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-schedules']);
      setForm({ doctorId: '', date: '', startTime: '', endTime: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => scheduleAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['all-schedules']),
  });

  if (isLoading) return <DashboardLayout role="ADMIN"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="ADMIN">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold mb-4">Add Schedule</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2">
            <option value="">Select Doctor</option>
            {doctors?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2" />
          <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2" />
          <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2" />
        </div>
        <button onClick={() => createMutation.mutate(form)} className="mt-4 bg-primary text-white px-4 py-2 rounded-xl">Add Schedule</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Doctor', 'Date', 'Start', 'End', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules?.slice(0, 50).map((s) => (
              <tr key={s.id} className="border-t border-gray-50">
                <td className="px-6 py-4 text-sm">{s.doctorName}</td>
                <td className="px-6 py-4 text-sm">{s.date}</td>
                <td className="px-6 py-4 text-sm">{s.startTime}</td>
                <td className="px-6 py-4 text-sm">{s.endTime}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    s.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>{s.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteMutation.mutate(s.id)} className="text-danger text-sm hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
