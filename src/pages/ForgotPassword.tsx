import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden bg-[var(--background)] px-4">
      {/* Background Animated Gradients */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/50">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--muted)] mb-6 shadow-sm mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            </div>
            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
              Reset Password
            </h2>
            <p className="text-[var(--muted-foreground)] mt-2 font-medium">
              {isSent 
                ? 'Check your inbox for a link to reset your password.' 
                : 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                  placeholder="you@example.com"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 mt-4 rounded-xl font-black text-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 border border-transparent"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link to="/login" className="w-full py-4 mt-4 rounded-xl font-black text-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                Back to Login
              </Link>
            </motion.div>
          )}

          {!isSent && (
            <p className="mt-8 text-center text-[var(--muted-foreground)] text-sm font-medium">
              Remember your password?{' '}
              <Link to="/login" className="text-[var(--primary)] font-bold hover:underline">
                Log in
              </Link>
            </p>
          )}

        </div>
      </motion.div>
    </div>
  );
};
