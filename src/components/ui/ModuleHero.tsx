import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Stat = { label: string; value: string };

type ModuleHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  stats?: Stat[];
  actions?: ReactNode;
};

export const ModuleHero = ({ eyebrow, title, description, stats, actions }: ModuleHeroProps) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative mb-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 lg:mb-8"
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.12),transparent_45%)]" />
    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
          {eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">{description}</p>
        {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
      </div>
      {stats && stats.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto lg:min-w-[320px]">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-center sm:px-4">
              <p className="text-lg font-bold text-[var(--primary)] sm:text-xl">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.section>
);

export default ModuleHero;
