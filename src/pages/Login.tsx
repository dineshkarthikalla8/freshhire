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
  
  const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000);
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    if (!otpSent && captchaInput !== captchaValue.toString()) {
      toast.error('Invalid Security Code. Please try again.');
      setCaptchaValue(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    
    if (!isLogin && !otpSent) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      
      const toastId = toast.loading('Sending verification email...');
      try {
        const response = await fetch('http://localhost:8000/api/v1/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
        
        setOtpSent(true);
        toast.success(`OTP sent to ${email}`, { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error('Could not send OTP. Backend issue?', { id: toastId });
      }
      return;
    }

    if (!isLogin && otpSent) {
      if (enteredOtp !== generatedOtp) {
        toast.error('Invalid OTP. Please try again.');
        return;
      }
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
      if (!isLogin) setOtpSent(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)] px-4">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-32 h-32 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-3xl border border-[var(--primary)]/20 backdrop-blur-3xl hidden lg:block shadow-2xl"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-[10%] w-40 h-40 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-full border border-teal-500/20 backdrop-blur-3xl hidden lg:block shadow-2xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/50">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-teal-400 mb-6 shadow-lg shadow-[var(--primary)]/30 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            </Link>
            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[var(--muted-foreground)] mt-2 font-medium">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start scanning and improving your resume today.'}
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] font-bold hover:bg-[var(--muted)] transition-all shadow-sm mb-6"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-[var(--border)]"></div>
            <span className="flex-shrink-0 mx-4 text-[var(--muted-foreground)] text-sm font-medium">or continue with email</span>
            <div className="flex-grow border-t border-[var(--border)]"></div>
          </div>

          {otpSent && !isLogin ? (
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/></svg>
                </div>
                <h3 className="text-xl font-bold">Check your email</h3>
                <p className="text-[var(--muted-foreground)] text-sm mt-2">We've sent a 6-digit code to <br/><span className="font-bold text-[var(--foreground)]">{email}</span></p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--foreground)] mb-2 text-center">Enter 6-Digit OTP</label>
                <input 
                  type="text" 
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-black text-center tracking-[0.5em] text-2xl"
                  placeholder="------"
                  maxLength={6}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || enteredOtp.length !== 6}
                className="w-full py-4 mt-4 rounded-xl font-black text-lg bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/30 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </motion.button>

              <p className="text-center mt-4">
                <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium">
                  Wrong email? Go back
                </button>
              </p>
            </form>
          ) : (
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

            <div>
              <label className="block text-sm font-bold text-[var(--foreground)] mb-2">
                Security Check: Enter <span className="bg-[var(--muted)] px-3 py-1 rounded-md text-[var(--primary)] font-black tracking-[0.3em]">{captchaValue}</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium text-center tracking-widest font-black"
                  placeholder="Enter numbers"
                  maxLength={4}
                />
                <button 
                  type="button" 
                  onClick={() => { setCaptchaValue(generateCaptcha()); setCaptchaInput(''); }}
                  className="px-4 flex items-center justify-center rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all"
                  title="Refresh Captcha"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
              </div>
            </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl font-black text-lg bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/30 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 border border-transparent"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </form>
          )}

          <p className="mt-8 text-center text-[var(--muted-foreground)] text-sm font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--primary)] font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
};
