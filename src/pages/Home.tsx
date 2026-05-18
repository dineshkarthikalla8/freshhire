import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedPersona from '../components/AnimatedPersona';
import Footer from '../components/Footer';
import { BUNDLE_PRICE } from '../config/pricing';

const featureItems = [
  {
    title: 'ATS Resume Scan',
    desc: 'See if your resume is readable by ATS systems and get actionable fixes.',
  },
  {
    title: 'DSA Roadmap',
    desc: 'Follow a focused path instead of randomly solving problems.',
  },
  {
    title: 'Aptitude + Verbal',
    desc: 'Practice the questions students actually need for placements.',
  },
  {
    title: 'Interview Stories',
    desc: 'Learn from moderated company experiences before your own interview.',
  },
];

const testimonials = [
  {
    quote: 'FreshHire made my resume readable by ATS tools and helped me focus on the exact topics I was weak at.',
    name: 'Ananya, CSE Student',
  },
  {
    quote: 'The DSA roadmap and panel-based learning flow made interview prep feel structured instead of random.',
    name: 'Rahul, Final Year Engineering',
  },
  {
    quote: 'I used the aptitude and verbal sections every day. The site feels like a proper job-ready toolkit.',
    name: 'Priya, Graduate Applicant',
  },
];

const pricingPlans = [
  {
    name: 'Free Preview',
    price: '₹0',
    description: 'Explore the platform and preview what members get.',
    features: ['Landing page access', 'Public preview of modules', 'Login to unlock practice'],
    cta: 'Create account',
    to: '/login',
    featured: false,
  },
  {
    name: 'Starter Bundle',
    price: `₹${BUNDLE_PRICE}`,
    description: 'One-time payment for the full student job-ready bundle.',
    features: ['DSA, Aptitude, Reasoning, Verbal', 'ATS resume check', 'Progress tracking'],
    cta: 'Unlock now',
    to: '/payment',
    featured: true,
  },
  {
    name: 'Focus Plus',
    price: 'Custom',
    description: 'For more advanced roadmap and future premium add-ons.',
    features: ['Roadmap updates', 'Priority features', 'Future interview packs'],
    cta: 'Login first',
    to: '/login',
    featured: false,
  },
];

const statCards = [
  { label: 'ATS', value: 'Score + fix' },
  { label: 'DSA', value: 'Top roadmap' },
  { label: 'Price', value: `One-time ₹${BUNDLE_PRICE}` },
];

const FeatureCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-shadow hover:shadow-lg">
    <div className="text-lg font-black">{title}</div>
    <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-6">{desc}</p>
  </div>
);

const Home = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <main>
        <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 pt-6 pb-16 lg:grid-cols-2 lg:items-center lg:pt-10 lg:pb-24">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              FreshHire 2.0 • ATS + DSA + Aptitude
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.5 }}
              className="mt-6 max-w-2xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl"
            >
              Build a resume that gets
              <span className="block bg-gradient-to-r from-[var(--primary)] via-teal-400 to-[var(--primary)] bg-clip-text text-transparent">noticed.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted-foreground)]"
            >
              FreshHire combines an ATS-aware resume scanner, a curated DSA roadmap, and focused aptitude practice — designed to make students and early-career engineers interview-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/login" className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-teal-400 px-6 py-3 font-bold text-white shadow-lg shadow-[var(--primary)]/20">
                Start Free Scan
              </Link>
              <Link to="/payment" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 font-bold text-[var(--foreground)]">
                Unlock for ₹{BUNDLE_PRICE}
              </Link>
            </motion.div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {statCards.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{item.label}</div>
                  <div className="mt-2 text-lg font-black">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-teal-400/10 blur-3xl" />
            <div className="relative rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--muted-foreground)]">Live preview</span>
                <span className="text-sm font-black">₹{BUNDLE_PRICE}</span>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-[var(--background)] p-4">
                <AnimatedPersona />
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-black md:text-4xl">Everything in one place</h2>
            <p className="mt-3 text-[var(--muted-foreground)] leading-7">A single platform for resume checking, placement prep, and interview stories.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featureItems.map((item) => (
              <FeatureCard key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black">Testimonials</h2>
                <p className="mt-2 text-[var(--muted-foreground)]">What students say after using FreshHire.</p>
              </div>
              <div className="hidden sm:flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSlide(index)}
                    className={`h-2 w-8 rounded-full transition-colors ${slide === index ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.5rem]">
              <motion.div animate={{ x: `-${slide * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} className="flex">
                {testimonials.map((item, index) => (
                  <div key={index} className="min-w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-8">
                    <div className="text-6xl leading-none text-[var(--primary)]">“</div>
                    <p className="mt-4 max-w-3xl text-xl leading-9 text-[var(--foreground)]">{item.quote}</p>
                    <div className="mt-6 text-sm font-bold text-[var(--muted-foreground)]">{item.name}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-black md:text-4xl">Pricing</h2>
            <p className="mt-3 text-[var(--muted-foreground)]">Simple student pricing with one-time unlock.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`rounded-[2rem] border p-6 ${plan.featured ? 'border-[var(--primary)] bg-[var(--card)] shadow-lg shadow-[var(--primary)]/10' : 'border-[var(--border)] bg-[var(--card)]'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{plan.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                  </div>
                  {plan.featured && <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-black uppercase text-white">Best value</span>}
                </div>
                <div className="mt-6 text-4xl font-black">{plan.price}</div>
                <ul className="mt-6 space-y-3 text-sm text-[var(--muted-foreground)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.to}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-bold ${plan.featured ? 'bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white' : 'border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">About FreshHire</h2>
              <p className="mt-4 text-[var(--muted-foreground)] leading-7">
                FreshHire is a focused preparation platform for campus placements and early-career hiring. We provide an ATS-grade resume scanner, a priority DSA roadmap, aptitude and reasoning practice, and a moderated interview-experience library so you can learn from real candidate journeys.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-xl font-black">Job-ready focus</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                <li>ATS-aware resume scanner with clear recommendations.</li>
                <li>Curated DSA roadmap and problem sets with progress tracking.</li>
                <li>Practice sections for aptitude, reasoning, and verbal skills.</li>
                <li>Moderated interview experiences with optional registration numbers.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-4">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <h2 className="text-2xl font-black md:text-3xl">Interview experiences are now on a dedicated page</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--muted-foreground)] leading-7">Browse approved company stories, open PDF media in the viewer, and submit your own story without cluttering the homepage.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/experiences" className="rounded-2xl bg-[var(--foreground)] px-6 py-3 font-bold text-[var(--background)]">Browse experiences</Link>
              <Link to="/experiences" className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-3 font-bold text-[var(--foreground)]">Share your story</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
