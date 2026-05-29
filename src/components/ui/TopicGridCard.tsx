import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

type TopicGridCardProps = {
  title: string;
  description?: string;
  focus?: string[];
  href: string;
  index: number;
  accentClass?: string;
  meta?: string;
};

export const TopicGridCard = ({
  title,
  description,
  focus = [],
  href,
  index,
  accentClass = 'from-[var(--primary)] to-[#ff4d4d]',
  meta,
}: TopicGridCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ delay: index * 0.04 }}
    whileHover={{ y: -4 }}
    className="glass-card flex h-full flex-col p-5 sm:p-6"
  >
    <div className={`h-1 rounded-full bg-gradient-to-r ${accentClass}`} />
    <div className="mt-4 flex items-start justify-between gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
        <FiBookOpen className="h-5 w-5" />
      </div>
      <span className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
    <h3 className="mt-4 text-lg font-bold leading-snug">{title}</h3>
    {description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>}
    {focus.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {focus.slice(0, 3).map((item) => (
          <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
            {item}
          </span>
        ))}
      </div>
    )}
    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
      {meta && <span className="text-xs text-[var(--muted-foreground)]">{meta}</span>}
      <Link
        to={href}
        className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:shadow-[var(--glow-red)]"
      >
        Open <FiArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </motion.article>
);

export default TopicGridCard;
