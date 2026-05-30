import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiUsers, FiTag, FiMessageSquare, FiCreditCard, FiBookOpen, FiLogOut, FiUpload } from 'react-icons/fi';
import headerLogo from '../../assets/header-logo.png';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { to: '/admin', label: 'Overview', icon: FiBarChart2, end: true },
  { to: '/admin#members', label: 'Members', icon: FiUsers },
  { to: '/admin#coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin#experiences', label: 'Stories', icon: FiMessageSquare },
  { to: '/admin#subscriptions', label: 'Billing', icon: FiCreditCard },
  { to: '/admin#content', label: 'Content Studio', icon: FiBookOpen },
  { to: '/admin#docs', label: 'Upload Docs', icon: FiUpload },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { pathname, hash } = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentHash = hash || '';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Fixed desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
        <Link to="/" className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-5 py-5">
            <img src={headerLogo} alt="FreshHire" className="h-9 w-9 object-contain" />
            <span className="font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
              Fresh<span className="text-[var(--primary)]">Hire</span>
            </span>
          </Link>
          <p className="px-5 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Admin Panel
          </p>
          <nav className="flex-1 space-y-1 p-3">
            {adminNav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  (pathname === '/admin' && to === '/admin' && currentHash === '') || (to.includes(currentHash) && currentHash !== '')
                    ? 'bg-[var(--primary)] text-white shadow-[var(--glow-red)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[var(--border)] p-4 space-y-3">
            <Link to="/dashboard" className="btn-outline block w-full py-2.5 text-center text-sm">
              User view
            </Link>
            <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <FiLogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
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
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-0 top-0 flex h-full w-[min(320px,88vw)] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <div className="flex items-center gap-2">
                  <img src={headerLogo} alt="FreshHire" className="h-8 w-8 object-contain" />
                  <span className="font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
                    Fresh<span className="text-[var(--primary)]">Hire</span>
                  </span>
                </div>
                <button type="button" onClick={closeMenu} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  Close
                </button>
              </div>
              <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Admin Panel
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {adminNav.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      (pathname === '/admin' && to === '/admin' && currentHash === '') || (to.includes(currentHash) && currentHash !== '')
                        ? 'bg-[var(--primary)] text-white shadow-[var(--glow-red)]'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-[var(--border)] p-4 space-y-3">
                <Link to="/dashboard" onClick={closeMenu} className="btn-outline block w-full py-2.5 text-center text-sm">
                  User view
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiLogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:ml-60">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/85 px-4 py-3 backdrop-blur-2xl lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:bg-[var(--muted)]"
            aria-label="Open admin menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Admin Panel</p>
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">FreshHire</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
