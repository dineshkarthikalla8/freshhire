import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      setIsSent(true);
      toast.success('Password reset link sent!');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--background)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
      >
        <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)]">
          <FiArrowLeft /> Back to login
        </Link>
        <h1 className="mt-4 text-2xl font-bold" style={{ fontFamily: 'var(--heading-font)' }}>Reset password</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {isSent ? 'Check your inbox for the reset link.' : 'We will send a recovery link to your email.'}
        </p>

        {!isSent ? (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        ) : (
          <Link to="/login" className="btn-primary mt-6 block py-3 text-center text-sm">Back to login</Link>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
