import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type PageShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  className?: string;
  cta?: ReactNode;
  /** Use inside dashboard layout — skips duplicate large hero spacing */
  compact?: boolean;
};

const PageShell = ({ eyebrow, title, description, children, className = '', cta, compact = false }: PageShellProps) => {
  if (compact) {
    return (
      <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--background)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] space-y-6 sm:space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ fontFamily: 'var(--heading-font)' }}>
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">{description}</p>
            </div>
            {cta ? <div className="shrink-0">{cta}</div> : null}
          </div>
        </motion.section>
        {children}
      </div>
    </div>
  );
};

export default PageShell;
