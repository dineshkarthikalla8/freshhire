import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCpu,
  FiFileText,
  FiBookOpen,
  FiUsers,
  FiTarget,
  FiZap,
  FiBarChart2,
  FiAward,
} from 'react-icons/fi';
import Footer from '../components/Footer';
import { AnimatedText } from '../components/ui/AnimatedText';
import { GlassCard } from '../components/ui/GlassCard';
import HeroDashboardPreview from '../components/home/HeroDashboardPreview';
import { useStudyContent } from '../context/StudyContentContext';
import { useAuth } from '../context/AuthContext';

const companies = ['TCS', 'Infosys', 'Wipro', 'Tech Mahindra', 'HCLTech', 'Cognizant', 'Capgemini', 'Accenture'];

const features = [
  { icon: FiFileText, title: 'ATS Resume Scan', desc: 'AI-powered resume analysis with keyword matching and actionable fixes.' },
  { icon: FiCpu, title: 'DSA Roadmap', desc: 'Curated interview-focused problems with progress tracking and topic-wise paths.' },
  { icon: FiBookOpen, title: 'Aptitude & Verbal', desc: 'Structured practice for quant, reasoning, and verbal placement rounds.' },
  { icon: FiUsers, title: 'Interview Experience', desc: 'Read and post real placement interview experiences by company.' },
  { icon: FiTarget, title: 'Mock Contests', desc: 'Timed challenges with leaderboards to simulate placement pressure.' },
];

const platformStats = [
  { label: 'DSA Pathways', value: 'Curated' },
  { label: 'Study Topics', value: '40+' },
  { label: 'Interview Experiences', value: '100+' },
  { label: 'Avg. Resume Score', value: '78%' },
];

const testimonials = [
  { name: 'Raghu Ram', role: '3rd Year CSE', quote: 'The DSA roadmap and resume scanner helped me prepare in a simple, focused way.' },
  { name: 'Ramu', role: 'Final Year Student', quote: 'The interview experiences and practice sections made daily prep much easier.' },
  { name: 'Rishitha', role: 'B.Tech CSE', quote: 'FreshHire feels easy to use, and I can track my prep without distraction.' },
];

const Home = () => {
  const { dsaTopics } = useStudyContent();
  const { authSettings } = useAuth();
  const isPaidMode = authSettings.pricingMode === 'paid';

  const faqs = [
    { 
      q: 'Is this platform free?', 
      a: isPaidMode 
        ? `FreshHire offers a Premium Lifetime Pass for only ₹${authSettings.premiumPrice ?? 299} which gives you permanent access to all preparation tracks without recurring subscriptions.`
        : 'Yes! FreshHire is completely free for students to practice and prepare for placements.' 
    },
    { q: 'Do I need an account for Interview Experience?', a: 'No. Browse and post interview experiences by company without logging in.' },
    { q: 'How do I sign in?', a: 'Only Google sign-in is supported — quick and secure for students. No manual email/password signup.' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <section className="relative px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--primary)]/12 blur-[130px]" />
        </div>
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
              AI-Powered Placement Prep
            </p>
            <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.35rem]" style={{ fontFamily: 'var(--heading-font)' }}>
              Crack Placements <AnimatedText variant="glow">Smarter</AnimatedText> with AI
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
              Resume scoring, DSA roadmaps, aptitude drills, and interview experiences — one platform built for campus placements.
            </p>
            <p className="mt-4 text-sm font-semibold text-[var(--primary)]">
              {isPaidMode ? 'Premium Lifetime Pass Platform' : '100% Free for Students'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/login" className="btn-primary px-8 py-3.5 text-center text-sm sm:inline-flex">Continue with Google</Link>
              <Link to="/experiences" className="btn-outline px-8 py-3.5 text-center text-sm sm:inline-flex">Interview Experience</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.12 }}>
            <HeroDashboardPreview />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto mt-16 max-w-[1280px] lg:mt-20">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Trusted by students targeting</p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-40 grayscale sm:gap-12">
            {companies.map((name) => (
              <span key={name} className="text-sm font-bold sm:text-base">{name}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Platform stats */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {platformStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center sm:p-6"
            >
              <p className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <p className="section-eyebrow">Features</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
              Everything You Need to <AnimatedText variant="shimmer">Get Hired</AnimatedText>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--muted-foreground)]">One workspace for resume, coding, aptitude, and interview prep.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <GlassCard key={f.title} delay={i * 0.05} className="text-center xl:text-left">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] xl:mx-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.desc}</p>
                </GlassCard>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/login" className="btn-primary inline-flex px-10 py-3.5 text-sm">Explore All Features</Link>
          </div>
        </div>
      </section>

      {dsaTopics.length > 0 && (
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="text-center">
              <p className="section-eyebrow">DSA Topics</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
                DSA Concept Guides & Notes
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--muted-foreground)]">Use the content studio to add and manage DSA study sheets, formulas, tips, and practice materials.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dsaTopics.slice(0, 6).map((topic, index) => (
                <GlassCard key={topic.id} delay={index * 0.05} className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">DSA</p>
                  <h3 className="mt-2 text-lg font-bold">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{topic.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why FreshHire */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow">Why FreshHire</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
              Built like a <AnimatedText variant="pulse">mid-tier SaaS</AnimatedText> product
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">Polished dashboards, responsive layouts, and focused study flows — not a cluttered question dump.</p>
            <ul className="mt-6 space-y-4">
              {[
                { icon: FiZap, text: 'Fast, dark UI optimized for long study sessions' },
                { icon: FiBarChart2, text: 'Progress charts, streaks, and roadmaps on one dashboard' },
                { icon: FiAward, text: 'Contests and leaderboards to stay competitive' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Resume ATS', 'DSA Mastery', 'Aptitude', 'Stories'].map((label, i) => (
              <div key={label} className="glass-card p-5 text-center">
                <p className="text-2xl font-bold text-[var(--primary)]">{['78%', '48', '84%', '50+'][i]}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <p className="section-eyebrow">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>Students who prepared smarter with FreshHire</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <GlassCard key={t.name} delay={i * 0.06}>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-[var(--primary)]">{t.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-[800px]">
          <div className="text-center">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold" style={{ fontFamily: 'var(--heading-font)' }}>Common questions</h2>
          </div>
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <GlassCard key={f.q} delay={i * 0.05} className="!p-5">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 mb-8 overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-br from-[#1a0a0a] via-[var(--card)] to-[var(--surface)] p-8 text-center sm:mx-6 sm:p-12 lg:mx-8">
        <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--heading-font)' }}>Ready to crack your dream offer?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--muted-foreground)] sm:text-base">Join thousands of students preparing smarter with FreshHire.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/login" className="btn-primary px-10 py-3.5 text-sm">Sign in</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
