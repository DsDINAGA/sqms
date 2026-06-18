import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorAPI } from '../../services';

export default function PatientDoctors() {
  const [search, setSearch] = useState('');
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', search],
    queryFn: () => doctorAPI.getAll(search).then((r) => r.data.data),
  });

  if (isLoading) return <DashboardLayout role="PATIENT"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="PATIENT">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {doc.name.charAt(3)}
            </div>
            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
            <p className="text-primary text-sm font-medium mt-1">{doc.specialization}</p>
            <p className="text-gray-500 text-sm mt-1">{doc.qualification}</p>
            <p className="text-gray-400 text-xs mt-2">{doc.availability}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
