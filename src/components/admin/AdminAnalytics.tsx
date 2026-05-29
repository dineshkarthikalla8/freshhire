import { GlassCard } from '../ui/GlassCard';

type AdminAnalyticsProps = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    signups: number;
  };
};

export const AdminAnalytics = ({ stats }: AdminAnalyticsProps) => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Premium Users', value: stats.activeUsers },
        { label: 'Total Revenue', value: `₹${stats.revenue}` },
        { label: 'New Signups', value: stats.signups },
      ].map((s, i) => (
        <GlassCard key={s.label} delay={i * 0.05}>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--primary)]">{s.value}</p>
        </GlassCard>
      ))}
    </div>
  </div>
);

export default AdminAnalytics;
