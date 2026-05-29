import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FiArrowUpRight, FiCode, FiFileText, FiBookOpen } from 'react-icons/fi';
import { GlassCard } from '../components/ui/GlassCard';

const defaultDsaData = [
  { topic: 'Mon', solved: 0 },
  { topic: 'Tue', solved: 0 },
  { topic: 'Wed', solved: 0 },
  { topic: 'Thu', solved: 0 },
  { topic: 'Fri', solved: 0 },
  { topic: 'Sat', solved: 0 },
  { topic: 'Sun', solved: 0 },
];

const defaultTopicProgress = [
  { name: 'Arrays & Hashing', pct: 0 },
  { name: 'Two Pointers', pct: 0 },
  { name: 'Dynamic Programming', pct: 0 },
  { name: 'Graphs', pct: 0 },
];

const defaultRoadmaps = [
  { title: 'Top 150 DSA', progress: 0, problems: '0/150', to: '/dsa' },
  { title: 'Aptitude Prep', progress: 0, problems: '0/50', to: '/aptitude' },
  { title: 'Reasoning & Logic', progress: 0, problems: '0/40', to: '/reasoning' },
];

const defaultHeatmap = Array.from({ length: 7 * 12 }, () => 0);

export const DashboardHome = () => {
  // Dynamic browser-side state
  const [dsaData, setDsaData] = useState(defaultDsaData);
  const [topicProgress, setTopicProgress] = useState(defaultTopicProgress);
  const [roadmaps, setRoadmaps] = useState(defaultRoadmaps);
  const [heatmap, setHeatmap] = useState(defaultHeatmap);
  const [overallStats, setOverallStats] = useState({
    resumeScore: 0,
    dsaSolved: 0,
    aptitudeScore: 0,
    reasoningScore: 0,
  });

  useEffect(() => {
    document.title = "Dashboard | FreshHire";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View your interview preparation progress on FreshHire.');
    }

    // Load dynamic data from browser local storage
    try {
      const stored = localStorage.getItem('freshhire_progress');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.dsaData) setDsaData(parsed.dsaData);
        if (parsed.topicProgress) setTopicProgress(parsed.topicProgress);
        if (parsed.roadmaps) setRoadmaps(parsed.roadmaps);
        if (parsed.heatmap) setHeatmap(parsed.heatmap);
        if (parsed.stats) setOverallStats({
           resumeScore: parsed.stats.resumeScore || 0,
           dsaSolved: parsed.stats.dsaSolved || 0,
           aptitudeScore: parsed.stats.aptitudeScore || 0,
           reasoningScore: parsed.stats.reasoningScore || 0,
        });
      }
    } catch (e) {
      console.error('Error loading progress from local storage', e);
    }
  }, []);

  const stats = [
    { label: 'Resume Score', value: `${overallStats.resumeScore}%`, sub: 'ATS match', ring: overallStats.resumeScore, icon: <FiFileText className="h-4 w-4 text-[var(--success)]" /> },
    { label: 'DSA Solved', value: `${overallStats.dsaSolved}`, sub: 'total problems', ring: null, icon: <FiCode className="h-4 w-4 text-[var(--primary)]" /> },
    { label: 'Aptitude Mastery', value: `${overallStats.aptitudeScore}%`, sub: 'avg score', ring: overallStats.aptitudeScore, icon: <FiBookOpen className="h-4 w-4 text-[var(--warning)]" /> },
    { label: 'Reasoning Mastery', value: `${overallStats.reasoningScore}%`, sub: 'avg score', ring: overallStats.reasoningScore, icon: <FiBookOpen className="h-4 w-4 text-[#8b5cf6]" /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</p>
              <div className="rounded-full bg-[var(--muted)] p-1.5">
                {s.icon}
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[var(--foreground)]">{s.value}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{s.sub}</p>
              </div>
              {s.ring !== null && (
                <div className="relative h-14 w-14">
                  <svg className="-rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeDasharray={`${s.ring * 0.88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2" delay={0.1}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">DSA Activity Flow</h2>
            <Link to="/dsa" className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">
              Practice now <FiArrowUpRight />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dsaData}>
                <XAxis dataKey="topic" stroke="#a0a0a0" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a0a0" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    color: 'var(--foreground)',
                  }}
                />
                <Bar dataKey="solved" radius={[6, 6, 0, 0]} animationDuration={900}>
                  {dsaData.map((_, i) => (
                    <Cell key={i} fill="var(--primary)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard delay={0.15}>
            <h2 className="mb-4 text-lg font-bold">DSA Topics</h2>
            <div className="space-y-4">
              {topicProgress.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-sm">
                    <span>{t.name}</span>
                    <span className="font-semibold text-[var(--primary)]">{t.pct}%</span>
                  </div>
                  <div className="progress-track mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="progress-fill"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-4 text-lg font-bold">Preparation Tracks</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((r, i) => (
              <GlassCard key={r.title} delay={0.2 + i * 0.05} className="flex flex-col">
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{r.problems} completed</p>
                <div className="progress-track mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.progress}%` }}
                    viewport={{ once: true }}
                    className="progress-fill"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[var(--muted-foreground)]">Progress</span>
                  <span className="font-semibold text-[var(--primary)]">{r.progress}%</span>
                </div>
                <Link to={r.to} className="btn-primary mt-4 py-2 text-center text-sm w-full block">
                  Continue
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>

        <GlassCard delay={0.3} className="lg:col-span-4">
          <h2 className="mb-4 text-lg font-bold">Activity Heatmap</h2>
          <div className="grid grid-cols-12 gap-1">
            {heatmap.map((level, i) => (
              <div
                key={i}
                className={`aspect-square heatmap-cell${level > 0 ? ` heatmap-cell-${Math.min(level, 4)}` : ''}`}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">Daily tracking map over the last 12 weeks</p>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/dsa', title: 'DSA Practice', desc: 'Top 150 problems' },
          { to: '/resume-scan', title: 'ATS Scan', desc: 'Score your resume' },
          { to: '/aptitude', title: 'Aptitude Tests', desc: 'Quant & logic preparation' },
          { to: '/verbal', title: 'Verbal Ability', desc: 'Improve english skills' },
        ].map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="glass-card block p-4 transition hover:border-[var(--primary)] hover:shadow-[var(--glow-red)] hover:-translate-y-1"
          >
            <p className="font-bold">{card.title}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
