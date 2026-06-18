import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Dashboard, CalendarMonth, Queue, People, History, Person,
  Logout, LocalHospital, DarkMode, LightMode, Assessment, Schedule,
} from '@mui/icons-material';

const patientLinks = [
  { to: '/patient', label: 'Dashboard', icon: Dashboard },
  { to: '/patient/appointments', label: 'Appointments', icon: CalendarMonth },
  { to: '/patient/queue', label: 'Queue Status', icon: Queue },
  { to: '/patient/doctors', label: 'Doctors', icon: People },
  { to: '/patient/history', label: 'History', icon: History },
  { to: '/patient/profile', label: 'Profile', icon: Person },
];

const doctorLinks = [
  { to: '/doctor', label: 'Dashboard', icon: Dashboard },
  { to: '/doctor/schedule', label: 'Schedule', icon: Schedule },
  { to: '/doctor/queue', label: 'Queue', icon: Queue },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: Dashboard },
  { to: '/admin/doctors', label: 'Doctors', icon: People },
  { to: '/admin/patients', label: 'Patients', icon: Person },
  { to: '/admin/schedules', label: 'Schedules', icon: Schedule },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarMonth },
  { to: '/admin/reports', label: 'Reports', icon: Assessment },
];

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const links = role === 'ADMIN' ? adminLinks : role === 'DOCTOR' ? doctorLinks : patientLinks;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-900 text-white' : 'bg-background'}`}>
      <aside className={`w-64 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg flex flex-col`}>
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <LocalHospital className="text-primary" />
            <span className="font-bold text-lg text-primary">SQMS</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === to
                  ? 'bg-primary text-white shadow-md'
                  : darkMode
                    ? 'text-gray-300 hover:bg-slate-700'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-primary'
              }`}
            >
              <Icon fontSize="small" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl ${
              darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-danger hover:bg-red-50"
          >
            <Logout fontSize="small" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm px-8 py-4 flex justify-between items-center`}>
          <div>
            <h1 className="text-xl font-semibold">
              {links.find((l) => l.to === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
