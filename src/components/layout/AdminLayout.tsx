import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiUsers, FiTag, FiMessageSquare, FiCreditCard, FiLogOut } from 'react-icons/fi';
import headerLogo from '../../assets/header-logo.png';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { to: '/admin', label: 'Overview', icon: FiBarChart2, end: true },
  { to: '/admin#members', label: 'Members', icon: FiUsers },
  { to: '/admin#coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin#experiences', label: 'Stories', icon: FiMessageSquare },
  { to: '/admin#subscriptions', label: 'Billing', icon: FiCreditCard },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { pathname, hash } = useLocation();
  const { logout } = useAuth();
  const currentHash = hash || '';

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
      
      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:ml-60">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
