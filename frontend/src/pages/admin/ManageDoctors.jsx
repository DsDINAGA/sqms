import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorAPI } from '../../services';

export default function ManageDoctors() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', qualification: '', contact: '', availability: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);
  const queryClient = useQueryClient();

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', search],
    queryFn: () => doctorAPI.getAll(search).then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => editId ? doctorAPI.update(editId, data) : doctorAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctors']);
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', specialization: '', qualification: '', contact: '', availability: '', email: '', password: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => doctorAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['doctors']),
  });

  const handleEdit = (doc) => {
    setEditId(doc.id);
    setForm({ name: doc.name, specialization: doc.specialization, qualification: doc.qualification, contact: doc.contact, availability: doc.availability, email: '', password: '' });
    setShowForm(true);
  };

  if (isLoading) return <DashboardLayout role="ADMIN"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="bg-primary text-white px-4 py-2 rounded-xl font-medium">
          Add Doctor
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold mb-4">{editId ? 'Edit Doctor' : 'Add Doctor'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {['name', 'specialization', 'qualification', 'contact', 'availability'].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-2"
              />
            ))}
            {!editId && (
              <>
                <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2" />
                <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border border-gray-200 rounded-xl px-4 py-2" />
              </>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => createMutation.mutate(form)} className="bg-primary text-white px-4 py-2 rounded-xl">
              {editId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-gray-200 px-4 py-2 rounded-xl">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Specialization', 'Qualification', 'Contact', 'Availability', 'Actions'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors?.map((doc) => (
              <tr key={doc.id} className="border-t border-gray-50">
                <td className="px-6 py-4 font-medium">{doc.name}</td>
                <td className="px-6 py-4 text-sm">{doc.specialization}</td>
                <td className="px-6 py-4 text-sm">{doc.qualification}</td>
                <td className="px-6 py-4 text-sm">{doc.contact}</td>
                <td className="px-6 py-4 text-sm">{doc.availability}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => handleEdit(doc)} className="text-primary text-sm hover:underline">Edit</button>
                  <button onClick={() => deleteMutation.mutate(doc.id)} className="text-danger text-sm hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
