import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password, !isLogin);
      if (!isLogin) {
        toast.success('Account created successfully!', { duration: 4000 });
      } else {
        toast.success('Logged in successfully!');
      }
      if (email === 'admin@freshhire.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const applyDemoCredentials = (kind: 'admin' | 'student') => {
    setIsLogin(true);
    if (kind === 'admin') {
      setEmail('admin@freshhire.com');
      setPassword('admin1234');
      toast.success('Admin demo credentials loaded');
      return;
    }

    setEmail('demo@freshhire.com');
    setPassword('demo1234');
    toast.success('Student demo credentials loaded');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)] px-4">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)]/20 blur-[120px] pointer-events-none" />
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-32 h-32 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-3xl border border-[var(--primary)]/20 backdrop-blur-3xl hidden lg:block shadow-2xl"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-[10%] w-40 h-40 bg-gradient-to-tl from-[var(--primary)]/10 to-transparent rounded-full border border-[var(--primary)]/20 backdrop-blur-3xl hidden lg:block shadow-2xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/50">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] mb-6 shadow-lg shadow-[var(--primary)]/30 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </Link>
            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[var(--muted-foreground)] mt-2 font-medium">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start scanning and improving your resume today.'}
              {isLogin ? 'Enter your details to access your dashboard.' : 'Use the demo credentials to test the full resume and DSA experience.'}
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] font-bold hover:bg-[var(--muted)] transition-all shadow-sm mb-6"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => applyDemoCredentials('student')}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left hover:border-[var(--primary)] transition-all"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Student demo</div>
              <div className="font-black text-[var(--foreground)]">demo@freshhire.com</div>
              <div className="text-sm text-[var(--muted-foreground)]">demo1234</div>
            </button>
            <button
              type="button"
              onClick={() => applyDemoCredentials('admin')}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left hover:border-[var(--primary)] transition-all"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Admin demo</div>
              <div className="font-black text-[var(--foreground)]">admin@freshhire.com</div>
              <div className="text-sm text-[var(--muted-foreground)]">admin1234</div>
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
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
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[var(--foreground)]">Password</label>
                {isLogin && <Link to="/forgot-password" className="text-sm font-bold text-[var(--primary)] hover:underline">Forgot?</Link>}
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 rounded-xl font-black text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/30 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 border border-transparent"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-[var(--muted-foreground)] text-sm font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--primary)] font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
          <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
            Demo users get full resume and DSA tracker access in this browser.
          </p>

        </div>
      </motion.div>
    </div>
  );
};
