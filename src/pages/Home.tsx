import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedLaptop } from '../components/AnimatedLaptop';

export const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] flex flex-col items-center overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,122,0,0.06),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_40%)] pointer-events-none" />

      <section className="w-full max-w-[1400px] px-6 pt-20 pb-16 lg:pt-28 lg:pb-20 flex flex-col lg:flex-row items-center gap-14 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.35 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm font-bold text-[var(--foreground)] mb-8 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_var(--primary)]" />
            FreshHire 2.0 is Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl lg:text-[6.8rem] font-black text-[var(--foreground)] leading-[0.95] tracking-tighter mb-6"
          >
            Black and orange <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#ffb36d]">career prep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-lg md:text-xl text-[var(--muted-foreground)] font-medium mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            A focused ATS scanner, interview practice system, and DSA roadmap built to feel clean, practical, and easy to use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] text-white font-black text-lg rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
              Start Scanning Free
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/dsa" className="w-full sm:w-auto px-8 py-4 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] font-bold text-lg rounded-xl hover:bg-[var(--muted)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-sm">
              View DSA Pathway
            </Link>
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">Local progress tracking</span>
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">₹29 subscription</span>
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">Admin tracking</span>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <AnimatedLaptop />
          <motion.div
            initial={{ y: 32, opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute top-6 -left-2 md:-left-6 bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)] p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-black shadow-inner">₹</div>
            <div>
              <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">Plan</p>
              <p className="font-black text-xl text-[var(--foreground)]">₹29 Unlock</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-10 border-y border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-sm overflow-hidden relative z-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent" />
        <motion.div animate={{ x: [0, -960] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="flex whitespace-nowrap items-center gap-16 px-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-2xl md:text-3xl font-black text-[var(--foreground)]/20">Google</span>
              <span className="text-2xl md:text-3xl font-black text-[var(--foreground)]/20">Amazon</span>
              <span className="text-2xl md:text-3xl font-black text-[var(--foreground)]/20">Meta</span>
              <span className="text-2xl md:text-3xl font-black text-[var(--foreground)]/20">Netflix</span>
              <span className="text-2xl md:text-3xl font-black text-[var(--foreground)]/20">Apple</span>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="w-full max-w-[1400px] px-6 py-20 lg:py-28 z-10">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
            What you get
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            A cleaner workflow that starts with the resume, then moves into learning, practice, and tracking.
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
          <motion.div variants={itemVariants} className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-3">Resume scan</p>
              <h3 className="text-3xl font-black mb-3 text-[var(--foreground)]">See what ATS sees</h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">Scan a resume, identify missing skills, and get clear fixes without clutter or noise.</p>
            </div>
            <div className="absolute right-[-6%] bottom-[-12%] w-[42%] h-[130%] bg-gradient-to-tr from-[var(--primary)]/18 to-transparent rounded-[2rem] blur-0 rotate-12" />
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[var(--primary)] text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-lg">
            <div className="absolute top-[-18%] right-[-10%] w-44 h-44 bg-white/15 blur-3xl rounded-full" />
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.2em] text-white/80 font-bold mb-3">Plan</p>
              <h3 className="text-3xl font-black leading-tight">₹29<br />one simple unlock</h3>
            </div>
            <p className="text-sm text-white/85 relative z-10">No confusing tiers, no noisy upsells.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-3">Practice</p>
              <h3 className="text-2xl font-black mb-3 text-[var(--foreground)]">150 guided DSA problems</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">A curated path for consistent practice and visible progress in your browser.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div className="relative z-10">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-3">Learning</p>
              <h3 className="text-2xl font-black mb-3 text-[var(--foreground)]">Role-based roadmaps</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">Structure your learning by job role, not by random lists.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-sm">
            <div className="relative z-10 max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-3">Tracking</p>
              <h3 className="text-3xl font-black mb-3 text-[var(--foreground)]">Progress that stays in your browser</h3>
              <p className="text-[var(--muted-foreground)] text-base leading-relaxed">Mark solved problems and keep your progress locally, with no extra friction.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="w-full bg-[var(--card)]/80 border-y border-[var(--border)] px-6 py-20 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <h3 className="text-xl font-black mb-3 text-[var(--foreground)]">Why it feels better</h3>
            <ul className="text-[var(--muted-foreground)] list-disc list-inside space-y-2">
              <li>Black base, not blue, so the page feels calmer and sharper.</li>
              <li>Orange is used only for emphasis and action.</li>
              <li>Sections follow a simple reading order: hero, proof, features, footer.</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <h3 className="text-xl font-black mb-3 text-[var(--foreground)]">User-friendly flow</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">A person lands on the hero, understands the value, sees the scan preview, then moves to learning and practice.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <h3 className="text-xl font-black mb-3 text-[var(--foreground)]">Built for trust</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">The design avoids generic neon gradients and keeps the hierarchy clear for real product use.</p>
          </div>
        </div>
      </section>

      <footer className="w-full bg-[var(--background)] border-t border-[var(--border)] relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-black text-[var(--foreground)]">FreshHire</h4>
            <p className="text-[var(--muted-foreground)] mt-2 max-w-md">A focused resume, practice, and interview prep product with a cleaner UI and easier navigation.</p>
          </div>
          <div className="flex gap-10">
            <div>
              <div className="font-bold text-[var(--foreground)]">Product</div>
              <ul className="text-[var(--muted-foreground)] mt-2 space-y-1">
                <li><a href="/practice">Practice</a></li>
                <li><a href="/resume-scan">Resume Scanner</a></li>
                <li><a href="/dsa">DSA Path</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-[var(--foreground)]">Company</div>
              <ul className="text-[var(--muted-foreground)] mt-2 space-y-1">
                <li><a href="/admin">Admin</a></li>
                <li><a href="/login">Login</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-[var(--muted-foreground)] py-6 border-t border-[var(--border)]">© {new Date().getFullYear()} FreshHire</div>
      </footer>
    </div>
  );
};
