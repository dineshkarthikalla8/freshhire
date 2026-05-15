import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="group text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-teal-400 flex items-center justify-center shadow-lg shadow-[var(--primary)]/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] group-hover:to-[var(--primary)] transition-all duration-300">
            FreshHire
          </span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="hidden md:block text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Home</Link>
          
          {user?.role === 'admin' ? (
             <Link to="/admin" className="hidden md:block text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Admin Panel</Link>
          ) : (
            <>
              <Link to="/dashboard" className="hidden md:block text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Dashboard</Link>
              <Link to="/dsa" className="hidden md:block text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">DSA Prep</Link>
            </>
          )}

          {user ? (
            <div className="hidden md:flex items-center gap-4 border-l border-[var(--border)] pl-4">
              <span className="text-sm font-bold text-[var(--foreground)] bg-[var(--muted)] px-3 py-1.5 rounded-full border border-[var(--border)]">{user.name}</span>
              <button onClick={handleLogout} className="text-xs font-bold text-[var(--muted-foreground)] hover:text-red-500 transition-colors">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Login</Link>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </motion.button>

          {!user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="text-sm font-bold bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all border border-transparent">
                Get Started
              </Link>
            </motion.div>
          )}
        </nav>
      </div>
    </header>
  );
};
