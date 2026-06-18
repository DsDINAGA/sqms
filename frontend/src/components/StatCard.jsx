import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  const colors = {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-teal-500 to-teal-600',
    accent: 'from-purple-500 to-purple-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          {Icon && <Icon className="text-white" />}
        </div>
      </div>
    </motion.div>
  );
}
