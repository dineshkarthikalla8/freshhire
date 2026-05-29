import { motion } from 'framer-motion';

const miniBars = [35, 55, 40, 75, 50, 65, 45, 85, 55, 70];

export const HeroDashboardPreview = () => (
  <div className="relative mx-auto w-full max-w-lg perspective-[1200px]">
    <div className="absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-[var(--primary)]/50 blur-[70px]" />
    <div className="absolute bottom-4 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-[var(--primary)]/30 blur-xl" />
    <motion.div className="animate-float relative" style={{ transformStyle: 'preserve-3d' }}>
      <div
        className="glass-card-glow overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl"
        style={{ transform: 'rotateX(8deg) rotateY(-12deg)' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
          <span className="ml-2 text-[10px] text-[var(--muted-foreground)]">dashboard.freshhire</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['72%', '12', '156', '84%'].map((v, i) => (
            <div key={i} className="rounded-lg bg-[var(--muted)] p-2 text-center">
              <div className="text-[8px] uppercase text-[var(--muted-foreground)]">
                {['Resume', 'Streak', 'Solved', 'Mock'][i]}
              </div>
              <div className="text-sm font-bold text-[var(--primary)]">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-20 items-end gap-1">
          {miniBars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
              className="flex-1 rounded-t bg-gradient-to-t from-[var(--accent)] to-[var(--primary)]"
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {['Arrays', 'Strings', 'DP'].map((t, i) => (
            <div key={t}>
              <div className="flex justify-between text-[9px] text-[var(--muted-foreground)]">
                <span>{t}</span>
                <span>{[68, 45, 22][i]}%</span>
              </div>
              <div className="progress-track mt-0.5">
                <div className="progress-fill" style={{ width: `${[68, 45, 22][i]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default HeroDashboardPreview;
