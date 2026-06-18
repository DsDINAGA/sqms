import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentAPI, queueAPI, doctorAPI } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorQueue() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorAPI.getAll().then((r) => r.data.data),
  });

  const doctor = doctors?.find((d) => d.userId === user?.id);

  const { data: queue, isLoading, refetch } = useQuery({
    queryKey: ['doctor-queue', doctor?.id],
    queryFn: () => queueAPI.getCurrent(doctor.id).then((r) => r.data.data),
    enabled: !!doctor?.id,
    refetchInterval: 5000,
  });

  const serveMutation = useMutation({
    mutationFn: () => queueAPI.serveNext(doctor.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-queue']);
      refetch();
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id) => appointmentAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-queue']);
      queryClient.invalidateQueries(['doctor-appointments']);
      refetch();
    },
  });

  if (!doctor) return <DashboardLayout role="DOCTOR"><LoadingSpinner /></DashboardLayout>;
  if (isLoading) return <DashboardLayout role="DOCTOR"><LoadingSpinner /></DashboardLayout>;

  const waiting = queue?.filter((q) => q.status === 'WAITING') || [];
  const serving = queue?.find((q) => q.status === 'SERVING');

  return (
    <DashboardLayout role="DOCTOR">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => serveMutation.mutate()}
          disabled={serveMutation.isPending || waiting.length === 0}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          Serve Next Patient
        </button>
        {serving && (
          <button
            onClick={() => completeMutation.mutate(serving.appointmentId)}
            disabled={completeMutation.isPending}
            className="bg-success text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Mark Complete (#{serving.tokenNumber})
          </button>
        )}
      </div>

      {serving && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-amber-600 font-medium">Currently Serving</p>
          <p className="text-3xl font-bold text-amber-800 mt-1">Token #{serving.tokenNumber}</p>
          <p className="text-sm text-amber-600 mt-1">{serving.yourToken}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold">Queue List ({waiting.length} waiting)</h2>
        </div>
        {waiting.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No patients in queue</p>
        ) : (
          waiting.map((q) => (
            <div key={q.queueId} className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
              <div>
                <p className="font-medium">Token #{q.tokenNumber}</p>
                <p className="text-sm text-gray-500">{q.yourToken}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Position: {q.patientsAhead + 1}</p>
                <p className="text-sm text-warning">~{q.estimatedWaitingMinutes} min wait</p>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
