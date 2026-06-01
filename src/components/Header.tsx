import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import headerLogo from '../assets/header-logo.png';
import { ThemeToggle } from './ThemeToggle';


const marketingLinks = [
  { to: '/#features', label: 'Features' },
  { to: '/experiences', label: 'Interview Experience' },
];

type HeaderProps = {
  variant?: 'marketing' | 'app';
};

export const Header = ({ variant = 'app' }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMarketing = variant === 'marketing';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const closeMenu = () => setMobileOpen(false);

  const drawerLinks = isMarketing
    ? marketingLinks
    : [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/aptitude', label: 'Aptitude' },
        { to: '/company-exams', label: 'Company Exams' },
        { to: '/dsa', label: 'DSA Practice' },
        { to: '/experiences', label: 'Interview Experience' },
        { to: '/reasoning', label: 'Reasoning' },
        { to: '/resume-scan', label: 'Resume Scan' },
        { to: '/verbal', label: 'Verbal' },
      ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[80] border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] xl:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img src={headerLogo} alt="FreshHire logo" className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
                Fresh<span className="text-[var(--primary)]">Hire</span>
              </span>
            </Link>
          </div>

          {isMarketing && (
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 xl:flex">
              {marketingLinks.map((link) => (
                <Link key={link.label} to={link.to} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="hidden text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] sm:block">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="hidden text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] sm:block">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary px-4 py-2 text-xs sm:px-5 sm:text-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[200] xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute left-0 top-0 flex h-full w-[min(320px,88vw)] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <span className="font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
                  Menu
                </span>
                <button type="button" onClick={closeMenu} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]" aria-label="Close menu">
                  ✕
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {drawerLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3.5 text-base font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 border-t border-[var(--border)] p-4">
                {user ? (
                  <button type="button" onClick={handleLogout} className="btn-outline w-full py-2.5 text-sm">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="btn-primary block py-2.5 text-center text-sm">
                    Continue with Google
                  </Link>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
