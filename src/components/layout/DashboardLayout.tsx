import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiCode,
  FiBookOpen,
  FiFileText,
  FiMessageSquare,
  FiHome,
  FiBell,
  FiMenu,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import headerLogo from '../../assets/header-logo.png';
import { ThemeToggle } from '../ThemeToggle';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/dsa', label: 'DSA Practice', icon: FiCode },
  { to: '/aptitude', label: 'Aptitude', icon: FiBookOpen },
  { to: '/resume-scan', label: 'Resume Scan', icon: FiFileText },
  { to: '/experiences', label: 'Interview Experience', icon: FiMessageSquare },
  { to: '/reasoning', label: 'Reasoning', icon: FiBookOpen },
  { to: '/verbal', label: 'Verbal', icon: FiBookOpen },
];

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dsa': 'DSA Practice',
  '/aptitude': 'Aptitude',
  '/reasoning': 'Reasoning',
  '/verbal': 'Verbal',
  '/resume-scan': 'Resume Scanner',
  '/experiences': 'Interview Experience',
};

const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  const isActive = (path: string) =>
    path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(path);

  return (
    <nav className="flex-1 space-y-2 overflow-y-auto p-4">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = isActive(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
              active
                ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] hover:translate-x-1'
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export const DashboardLayout = () => {
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const title =
    Object.entries(routeTitles).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Dashboard';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Fixed desktop sidebar — does not scroll */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
        <Link to="/" className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-5 py-5">
          <img src={headerLogo} alt="FreshHire" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
            Fresh<span className="text-[var(--primary)]">Hire</span>
          </span>
        </Link>
        <SidebarNav />
        <div className="shrink-0 border-t border-[var(--border)] p-4 space-y-4">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-red-500 transition-all">
            <FiLogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile left drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-0 top-0 flex h-full w-[min(300px,88vw)] flex-col border-r border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <span className="font-bold">Navigation</span>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  Close
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <div className="shrink-0 border-t border-[var(--border)] p-4">
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-red-500 transition-all">
                  <FiLogOut className="h-4 w-4 shrink-0" />
                  Log out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main column — only this scrolls */}
      <div className="flex min-h-screen flex-col lg:ml-64">
        <header className="sticky top-0 z-40 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/85 px-6 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:bg-[var(--muted)] lg:hidden"
              aria-label="Open sidebar menu"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>
                Welcome back, {firstName}
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {title} • {today}
              </p>
            </div>
            {/* Mobile title */}
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:bg-[var(--muted)]" aria-label="Notifications">
              <FiBell className="h-5 w-5 text-[var(--muted-foreground)]" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--primary)] ring-2 ring-[var(--card)]" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-red-600 text-sm font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:scale-105 hover:shadow-md hover:ring-[var(--primary)]/30"
              >
                {firstName.charAt(0).toUpperCase()}
              </button>
              
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/10"
                  >
                    <div className="border-b border-[var(--border)] px-4 py-3">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{user?.name || 'User'}</p>
                      <p className="truncate text-xs text-[var(--muted-foreground)]">{user?.email || ''}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--muted)]">
                        <FiUser className="h-4 w-4" /> Profile
                      </Link>
                      <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10">
                        <FiLogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
