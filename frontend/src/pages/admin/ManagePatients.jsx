import DashboardLayout from '../../layouts/DashboardLayout';

export default function ManagePatients() {
  return (
    <DashboardLayout role="ADMIN">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">Patient management is handled through the user registration system.</p>
        <p className="text-gray-400 text-sm mt-2">Patients register via the public registration page and appear in appointment records.</p>
      </div>
    </DashboardLayout>
  );
}
