import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientAppointments from '../pages/patient/PatientAppointments';
import BookAppointment from '../pages/patient/BookAppointment';
import QueueStatus from '../pages/patient/QueueStatus';
import PatientDoctors from '../pages/patient/PatientDoctors';
import PatientHistory from '../pages/patient/PatientHistory';
import PatientProfile from '../pages/patient/PatientProfile';

import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorSchedule from '../pages/doctor/DoctorSchedule';
import DoctorQueue from '../pages/doctor/DoctorQueue';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManagePatients from '../pages/admin/ManagePatients';
import ManageSchedules from '../pages/admin/ManageSchedules';
import ManageAppointments from '../pages/admin/ManageAppointments';
import Reports from '../pages/admin/Reports';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  return <Navigate to="/patient" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<RoleRedirect />} />

      <Route path="/patient" element={<ProtectedRoute roles={['PATIENT']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['PATIENT']}><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/book" element={<ProtectedRoute roles={['PATIENT']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/queue" element={<ProtectedRoute roles={['PATIENT']}><QueueStatus /></ProtectedRoute>} />
      <Route path="/patient/doctors" element={<ProtectedRoute roles={['PATIENT']}><PatientDoctors /></ProtectedRoute>} />
      <Route path="/patient/history" element={<ProtectedRoute roles={['PATIENT']}><PatientHistory /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute roles={['PATIENT']}><PatientProfile /></ProtectedRoute>} />

      <Route path="/doctor" element={<ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/schedule" element={<ProtectedRoute roles={['DOCTOR']}><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/doctor/queue" element={<ProtectedRoute roles={['DOCTOR']}><DoctorQueue /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute roles={['ADMIN']}><ManageDoctors /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute roles={['ADMIN']}><ManagePatients /></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute roles={['ADMIN']}><ManageSchedules /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute roles={['ADMIN']}><ManageAppointments /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
