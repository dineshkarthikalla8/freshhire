import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import problems from '../data/dsa';
import { ModuleHero } from '../components/ui/ModuleHero';
import { FiSearch } from 'react-icons/fi';

export const Practice = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const completed: Record<number, boolean> = {};
    problems.forEach((problem: { id: number }) => {
      completed[problem.id] = localStorage.getItem(`progress_v1_${problem.id}`) === 'true';
    });
    setCompletedMap(completed);
  }, []);

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProblems = normalizedQuery
    ? problems.filter((problem: { title: string; category: string; difficulty: string }) => {
        const haystack = `${problem.title} ${problem.category} ${problem.difficulty}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : problems;

  const groupedProblems = filteredProblems.reduce(
    (acc: Record<string, typeof problems>, problem: { category: string }) => {
      if (!acc[problem.category]) acc[problem.category] = [] as typeof problems;
      acc[problem.category].push(problem as (typeof problems)[0]);
      return acc;
    },
    {}
  );
  const categoryOrder = Object.keys(groupedProblems);
  const completionRate = problems.length ? Math.round((completedCount / problems.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="DSA Practice"
        title={
          <>
            Top 150 — <span className="text-[var(--primary)]">one focused track</span>
          </>
        }
        description="Curated interview questions by topic. Progress saves locally in your browser."
        stats={[
          { label: 'Progress', value: `${completionRate}%` },
          { label: 'Solved', value: String(completedCount) },
          { label: 'Total', value: String(problems.length) },
          { label: 'Topics', value: String(categoryOrder.length) },
        ]}
        actions={
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="input-field pl-10"
            />
          </div>
        }
      />

      <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 via-[var(--card)] to-[var(--primary)]/5 p-5 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--primary)]">Free access</p>
            <p className="mt-2 text-[var(--foreground)] font-semibold max-w-2xl">Everything in this practice track is open. No paywall, no subscription, no checkout.</p>
          </div>
          <a href="#dsa-topics" className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 font-black text-white shadow-lg shadow-rose-500/20 transition-transform hover:-translate-y-0.5">
            Start free
          </a>
        </div>
      </div>

      <div id="dsa-topics" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {categoryOrder.map((category, index) => {
          const categoryProblems = groupedProblems[category] || [];
          const completedInCategory = categoryProblems.filter((p: { id: number }) => completedMap[p.id]).length;
          const percent = categoryProblems.length ? Math.round((completedInCategory / categoryProblems.length) * 100) : 0;
          const sectionId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          return (
            <motion.article
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              className="glass-card flex flex-col p-5"
            >
              <div className="h-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff4d4d]" />
              <h3 className="mt-4 text-lg font-bold leading-tight">{category}</h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{categoryProblems.length} questions</p>
              <div className="progress-track mt-4">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">{completedInCategory}/{categoryProblems.length}</span>
                <span className="font-semibold text-[var(--primary)]">{percent}%</span>
              </div>
              <Link
                to={`/dsa/${sectionId}`}
                className="btn-primary mt-4 block py-2.5 text-center text-sm"
              >
                Open topic
              </Link>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default Practice;
