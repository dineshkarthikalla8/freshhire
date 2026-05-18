import { motion } from 'framer-motion';
import { reasoningTopics, panelAccent } from '../data/panels';

export const Reasoning = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] px-6 py-10">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Reasoning</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)]">Static reasoning drills built for fast interview prep.</h1>
              <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">All content is preloaded into the app so it works well on free hosting. Each section focuses on the exact logic patterns used in campus and entry-level hiring rounds.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-bold text-[var(--foreground)]">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">Logic</div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">Puzzles</div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">Patterns</div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">Analogies</div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reasoningTopics.map((topic, index) => (
            <motion.article
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg"
            >
              <div className={`h-1.5 rounded-full ${panelAccent[index % panelAccent.length]}`} />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[var(--foreground)]">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{topic.description}</p>
                </div>
                <div className="rounded-2xl bg-[var(--background)] px-3 py-2 text-xs font-black uppercase tracking-[0.25em] text-[var(--muted-foreground)]">{String(index + 1).padStart(2, '0')}</div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Focus areas</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topic.focus.map((item) => (
                      <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-bold text-[var(--foreground)]">{item}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Sample patterns</p>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--foreground)]">
                    {topic.examples.map((item) => (
                      <li key={item} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[var(--muted-foreground)]">Static lesson + practice notes</span>
                <button className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-black text-[var(--background)]">Start</button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reasoning;
