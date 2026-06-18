import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LocalHospital, CalendarMonth, Queue, Notifications, Assessment,
  ArrowForward, People, Speed,
} from '@mui/icons-material';

const features = [
  { icon: CalendarMonth, title: 'Online Appointment Booking', desc: 'Book appointments with your preferred doctor in seconds.' },
  { icon: Queue, title: 'Real-Time Queue Tracking', desc: 'Track your position in the queue with live updates.' },
  { icon: People, title: 'Doctor Availability', desc: 'View doctor schedules and available time slots instantly.' },
  { icon: Notifications, title: 'Instant Notifications', desc: 'Get email alerts for bookings, cancellations, and queue updates.' },
  { icon: Assessment, title: 'Smart Reporting', desc: 'Comprehensive analytics and PDF reports for administrators.' },
];

const steps = [
  { num: 1, title: 'Register', desc: 'Create your patient account' },
  { num: 2, title: 'Book Appointment', desc: 'Choose doctor, date & time' },
  { num: 3, title: 'Get Queue Token', desc: 'Receive your unique token' },
  { num: 4, title: 'Track Queue Live', desc: 'Monitor your position in real-time' },
  { num: 5, title: 'Visit Doctor', desc: 'Get consulted when it\'s your turn' },
];

const stats = [
  { value: '10K+', label: 'Patients Served' },
  { value: '50+', label: 'Expert Doctors' },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Queue Tracking' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LocalHospital className="text-primary text-3xl" />
            <span className="font-bold text-xl text-primary">SQMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
            <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-medium">Hospital Management</span>
          <h1 className="text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
            Smart Queue<br />
            <span className="text-primary">Management System</span>
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Skip the waiting room chaos. Book appointments, get queue tokens, and track your position in real-time.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/register" className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold flex items-center gap-2">
              Book Appointment <ArrowForward fontSize="small" />
            </Link>
            <Link to="/login" className="border-2 border-primary text-primary px-8 py-3 rounded-xl hover:bg-blue-50 transition font-semibold">
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
            <LocalHospital sx={{ fontSize: 120 }} className="opacity-20 absolute top-4 right-4" />
            <div className="space-y-4 relative z-10">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <p className="text-sm opacity-80">Current Serving</p>
                <p className="text-3xl font-bold">#15</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <p className="text-sm opacity-80">Your Token</p>
                <p className="text-3xl font-bold">#22</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 flex items-center gap-2">
                <Speed />
                <div>
                  <p className="text-sm opacity-80">Estimated Wait</p>
                  <p className="text-xl font-bold">35 Minutes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <p className="text-4xl font-extrabold">{stat.value}</p>
              <p className="text-blue-200 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
          <p className="text-gray-500 mt-2">Everything you need for seamless hospital visits</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Five simple steps to a better hospital experience</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto text-lg">
                  {step.num}
                </div>
                <h3 className="font-semibold mt-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LocalHospital className="text-primary" />
              <span className="font-bold text-white">SQMS</span>
            </div>
            <p className="text-sm">Smart Queue Management System for modern hospitals.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm">Email: support@sqms.com</p>
            <p className="text-sm">Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Links</h4>
            <div className="space-y-1 text-sm">
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Help Center</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; 2026 Smart Queue Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
