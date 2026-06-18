import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorAPI, scheduleAPI, appointmentAPI } from '../../services';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState('');

  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorAPI.getAll().then((r) => r.data.data),
  });

  const { data: schedules, isLoading: loadingSchedules } = useQuery({
    queryKey: ['schedules', selectedDoctor?.id, selectedDate],
    queryFn: () => scheduleAPI.getAll(selectedDoctor.id, selectedDate).then((r) => r.data.data),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const bookMutation = useMutation({
    mutationFn: (data) => appointmentAPI.book(data),
    onSuccess: () => navigate('/patient/appointments'),
    onError: (err) => setError(err.response?.data?.message || 'Booking failed'),
  });

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const handleConfirm = () => {
    bookMutation.mutate({
      doctorId: selectedDoctor.id,
      scheduleId: selectedSchedule.id,
    });
  };

  if (loadingDoctors) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="PATIENT">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 text-danger p-3 rounded-xl mb-4 text-sm">{error}</div>}

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          {step === 1 && (
            <>
              <h2 className="font-semibold text-lg mb-4">Choose Doctor</h2>
              <div className="space-y-3">
                {doctors?.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition"
                  >
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.specialization} • {doc.qualification}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-semibold text-lg mb-4">Choose Date</h2>
              <div className="grid grid-cols-3 gap-3">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setStep(3); }}
                    className="p-3 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition text-sm"
                  >
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-4 text-primary text-sm">← Back</button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-semibold text-lg mb-4">Choose Time Slot</h2>
              {loadingSchedules ? <LoadingSpinner /> : (
                <div className="grid grid-cols-3 gap-3">
                  {schedules?.filter((s) => s.status === 'AVAILABLE').map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => { setSelectedSchedule(slot); setStep(4); }}
                      className="p-3 border border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition text-sm"
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                  {schedules?.filter((s) => s.status === 'AVAILABLE').length === 0 && (
                    <p className="col-span-3 text-gray-500 text-center py-4">No available slots</p>
                  )}
                </div>
              )}
              <button onClick={() => setStep(2)} className="mt-4 text-primary text-sm">← Back</button>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-semibold text-lg mb-4">Confirm Booking</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p><span className="text-gray-500">Doctor:</span> <strong>{selectedDoctor?.name}</strong></p>
                <p><span className="text-gray-500">Date:</span> <strong>{selectedDate}</strong></p>
                <p><span className="text-gray-500">Time:</span> <strong>{selectedSchedule?.startTime} - {selectedSchedule?.endTime}</strong></p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="flex-1 border border-gray-200 py-3 rounded-xl">Back</button>
                <button
                  onClick={handleConfirm}
                  disabled={bookMutation.isPending}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
