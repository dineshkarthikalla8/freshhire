import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedText } from '../components/ui/AnimatedText';
import Footer from '../components/Footer';

const features = [
  'Full access with no payment wall',
  'Full ATS resume scan with keyword matching',
  'Complete Top 150 DSA interview pathway',
  'All aptitude, reasoning & verbal study packs',
  'Personal progress dashboard & analytics',
  'Read & search interview experiences',
];

export const Pricing = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--primary)]/10 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-[640px] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: 'var(--heading-font)' }}
          >
            <AnimatedText variant="glow">Free access</AnimatedText> — login and start
          </motion.h1>
          <p className="mx-auto mt-4 max-w-lg text-[var(--muted-foreground)]">
            Every study section is available without checkout. Sign in once and use the full platform.
          </p>

          <GlassCard glow delay={0.1} className="mt-10 text-left">
            <span className="inline-block rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">Open access</span>
            <h2 className="mt-4 text-2xl font-bold">FreshHire Free</h2>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-[var(--primary)]">₹0</span>
              <span className="text-[var(--muted-foreground)]">always free</span>
            </div>
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <FiCheck className="mt-0.5 shrink-0 text-[var(--primary)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <Link to="/login" className="btn-primary w-full max-w-sm py-4 text-center text-sm">
                Start free
              </Link>
            </div>
          </GlassCard>

          <p className="mt-8 text-sm text-[var(--muted-foreground)]">
            Interview Experience browsing and posting stays open. No payment step is required anywhere on the site.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
