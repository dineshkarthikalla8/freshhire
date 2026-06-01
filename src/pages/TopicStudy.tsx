import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studyTopicIntro, studyTopicSections, studyTopicTitles } from '../data/topicStudy';
import type { StudyTopicKey } from '../types/study';
import PageShell from '../components/layout/PageShell';
import { useAuth } from '../context/AuthContext';
import { PremiumPaywall } from '../components/PremiumPaywall';

const TopicStudy = () => {
  const { topic } = useParams();
  const { user, authSettings, refreshUser } = useAuth();
  const key = topic as StudyTopicKey | undefined;

  if (!key || !studyTopicSections[key]) {
    return <Navigate to="/dashboard" replace />;
  }

  if (authSettings.pricingMode === 'paid' && !user?.hasPaid) {
    return (
      <PageShell
        eyebrow="Study Topic"
        title={studyTopicTitles[key]}
        description="Unlock premium to access this topic study section."
      >
        <div className="max-w-4xl mx-auto">
          <PremiumPaywall user={user} refreshUser={refreshUser} originalPrice={authSettings.premiumPrice ?? 299} />
        </div>
      </PageShell>
    );
  }

  const sections = studyTopicSections[key];

  return (
    <PageShell
      eyebrow="Study Topic"
      title={studyTopicTitles[key]}
      description={studyTopicIntro[key]}
      cta={<Link to="/dashboard" className="btn-primary inline-flex items-center justify-center px-5 py-3 text-sm font-black">Back to dashboard</Link>}
    >
      <div className="grid gap-6">
        {sections.map((section, index) => (
          <motion.section key={section.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.35 }} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Section {String(index + 1).padStart(2, '0')}</div>
                <h2 className="mt-2 text-2xl font-black">{section.title}</h2>
                <p className="mt-2 max-w-3xl text-[var(--muted-foreground)] leading-7">{section.description}</p>
              </div>
              <span className="rounded-full bg-[var(--background)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Start</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Focus areas</div>
                <div className="mt-3 flex flex-wrap gap-2">{section.focusAreas.map((item) => <span key={item} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold">{item}</span>)}</div>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Sample patterns</div>
                <ul className="mt-3 space-y-2 text-sm leading-6">{section.samplePatterns.map((item) => <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--primary)] flex-shrink-0" /><span>{item}</span></li>)}</ul>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Tips</div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">{section.tips.map((item) => <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--accent)] flex-shrink-0" /><span>{item}</span></li>)}</ul>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Formulas</div>
                <ul className="mt-3 space-y-2 text-sm leading-6">{section.formulas.map((item) => <li key={item} className="flex gap-2"><span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--primary)] flex-shrink-0" /><span>{item}</span></li>)}</ul>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </PageShell>
  );
};

export default TopicStudy;
