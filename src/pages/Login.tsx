import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import headerLogo from '../assets/header-logo.png';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle, login, authSettings } = useAuth();

  useEffect(() => {
    if (!authSettings.allowNewAccountCreation && isSignUp) {
      setIsSignUp(false);
    }
  }, [authSettings.allowNewAccountCreation, isSignUp]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const userData = await loginWithGoogle();
      toast.success('Welcome to FreshHire!');
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Google sign-in failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const userData = await login(email, password, isSignUp, name, branch);
      if (isSignUp) {
        toast.success('Account created! A verification email has been sent to your inbox. Please verify your email before logging in.');
        setIsSignUp(false); // Switch to Sign In screen
        setPassword('');    // Clear password
      } else {
        toast.success('Welcome back!');
        navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error: any) {
      let msg = 'Authentication failed';
      if (error?.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. If you do not have an account, please switch to Sign Up.';
      } else if (error?.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please switch to Sign In.';
      } else if (error?.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (error?.message) {
        msg = error.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Premium subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)] to-orange-500" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105">
            <img src={headerLogo} alt="FreshHire" className="h-12 w-12 object-contain" />
            <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]" style={{ fontFamily: 'var(--heading-font)' }}>
              Fresh<span className="text-[var(--primary)]">Hire</span>
            </span>
          </Link>
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {isSignUp ? 'Already have an account? ' : 'New to FreshHire? '}
            {authSettings.allowNewAccountCreation ? (
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-[var(--primary)] transition-colors hover:text-red-500 hover:underline focus:outline-none"
              >
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            ) : (
              <span className="font-bold text-[var(--muted-foreground)]">New account creation is disabled</span>
            )}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || !authSettings.allowGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3.5 px-4 text-sm font-bold text-[var(--foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          {!authSettings.allowGoogleSignIn && (
            <p className="mt-2 text-center text-xs font-semibold text-[var(--muted-foreground)]">
              Google sign-in is currently disabled by admin.
            </p>
          )}

          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--card)] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] backdrop-blur-xl">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleEmailAuth}>
            {isSignUp && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 py-3 px-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none backdrop-blur-sm transition focus:border-[var(--primary)] focus:bg-[var(--background)] focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="Mahesh Babu"
                      required={isSignUp}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Branch
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 py-3 px-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none backdrop-blur-sm transition focus:border-[var(--primary)] focus:bg-[var(--background)] focus:ring-1 focus:ring-[var(--primary)]"
                      placeholder="e.g. CSE, ECE, MECH"
                      required={isSignUp}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <FiMail className="h-4 w-4 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 py-3 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none backdrop-blur-sm transition focus:border-[var(--primary)] focus:bg-[var(--background)] focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="student@college.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <FiLock className="h-4 w-4 text-[var(--muted-foreground)] transition-colors group-focus-within:text-[var(--primary)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 py-3 pl-11 pr-12 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none backdrop-blur-sm transition focus:border-[var(--primary)] focus:bg-[var(--background)] focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors hover:underline focus:outline-none"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition-all hover:-translate-y-0.5 hover:shadow-[var(--primary)]/40 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              {!loading && <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
