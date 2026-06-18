import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LocalHospital } from '@mui/icons-material';
import { authAPI } from '../../services';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setMessage('OTP sent to your email. Check console if mail is not configured.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword({ email, otp, newPassword });
      setMessage('Password reset successful! You can now login.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <LocalHospital className="text-primary text-5xl mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Reset Password</h1>
        </div>

        {error && <div className="bg-red-50 text-danger p-3 rounded-xl mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-50 text-success p-3 rounded-xl mb-4 text-sm">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={8}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <Link to="/login" className="block w-full bg-primary text-white py-3 rounded-xl font-semibold text-center">
            Go to Login
          </Link>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
