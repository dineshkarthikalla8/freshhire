import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { ModuleHero } from '../components/ui/ModuleHero';
import { GlassCard } from '../components/ui/GlassCard';
import { FiCheck, FiShield } from 'react-icons/fi';

export const Payment = () => {
  const navigate = useNavigate();
  const { handlePayment } = usePayment();

  const onPayClick = () => {
    handlePayment();
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  const includes = [
    'Full ATS resume scan with keyword report',
    'Complete Top 150 DSA question pathway',
    'All aptitude, reasoning & verbal study packs',
    'Interview Experience library (read & post)',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Free Access"
        title="Everything is open now"
        description="The bundle is free for everyone. No checkout, no paywall, no monthly or yearly fees."
        stats={[
          { label: 'Price', value: '₹0' },
          { label: 'Savings', value: '₹29' },
          { label: 'Type', value: 'Free' },
          { label: 'Secure', value: 'Open' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-lg font-bold">What&apos;s included</h2>
          <ul className="mt-4 space-y-3">
            {includes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-[var(--muted-foreground)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
                  <FiCheck className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm italic text-[var(--muted-foreground)]">
            &ldquo;Free access and the study flow is clean. It feels like a proper prep tool.&rdquo; — Student, NIT
          </p>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold">Free access</h2>
            <div className="text-right">
              <p className="text-sm text-[var(--muted-foreground)] line-through">₹29</p>
              <p className="text-3xl font-bold text-[var(--primary)]">₹0</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)]">
              Access is already unlocked. Click below to continue to your dashboard.
            </div>

            <button type="button" onClick={onPayClick} className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm">
              <FiShield />
              Continue for free
            </button>
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Open access mode</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Payment;
