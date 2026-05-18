import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const scenes = [
  {
    title: 'Laptop animation',
    badge: 'Laptop',
    render: () => (
      <div className="relative flex h-full items-center justify-center pt-2">
        <motion.div animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} className="relative flex flex-col items-center">
          <div className="absolute -top-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[var(--primary)]/10 blur-2xl" />
          <div className="relative z-10 h-28 w-[164px] rounded-t-[1.25rem] border border-[#1f1f1f] bg-[linear-gradient(180deg,#050505,#111)] shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-[#2b2b2b] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <div className="ml-2 h-1.5 flex-1 rounded-full bg-white/10" />
            </div>
            <div className="relative h-[82px] overflow-hidden bg-[linear-gradient(180deg,#101010,#161616)] px-3 py-3">
              <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="space-y-2">
                <div className="h-2.5 w-20 rounded-full bg-[var(--primary)]/90" />
                <div className="h-2.5 w-28 rounded-full bg-white/15" />
                <div className="h-2.5 w-24 rounded-full bg-white/10" />
                <div className="h-2.5 w-32 rounded-full bg-white/15" />
                <div className="h-2.5 w-18 rounded-full bg-white/10" />
              </motion.div>
              <motion.div
                className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[var(--primary)]/20 to-transparent"
                animate={{ y: [0, 52, 0] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
          <div className="relative -mt-1 h-8 w-[194px] rounded-b-[1.2rem] bg-[linear-gradient(180deg,#2a2a2a,#131313)] shadow-[0_22px_48px_rgba(0,0,0,0.45)]" />
          <div className="mt-3 flex gap-2">
            <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="h-10 w-10 rounded-[0.85rem] bg-[linear-gradient(180deg,#162033,#0b1220)] shadow-xl" />
            <motion.div animate={{ y: [0, 2, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }} className="h-10 w-10 rounded-[0.85rem] bg-[linear-gradient(180deg,#eef6f2,#d4eadf)] shadow-xl" />
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    title: 'Resume animation',
    badge: 'Resume',
    render: () => (
      <div className="relative flex h-full items-center justify-center">
        <motion.div animate={{ y: [0, -5, 0], rotate: [-0.8, 0.8, -0.8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative w-full rounded-[1.35rem] border border-[var(--border)] bg-[var(--background)] p-4 shadow-2xl">
          <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-teal-400/10" />
          <div className="relative overflow-hidden rounded-[1.15rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background),var(--card))] p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--muted-foreground)]">ATS Resume</div>
              <div className="rounded-full bg-[var(--primary)] px-3 py-1 text-[10px] font-black text-white">98%</div>
            </div>
            <div className="mt-4 space-y-3">
              <motion.div animate={{ width: ['72%', '84%', '72%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="h-3 rounded-full bg-[var(--primary)]/85" />
              <motion.div animate={{ width: ['92%', '78%', '92%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="h-3 rounded-full bg-[var(--muted)]" />
              <motion.div animate={{ width: ['64%', '88%', '64%'] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} className="h-3 rounded-full bg-[var(--muted)]" />
              <motion.div animate={{ width: ['80%', '70%', '80%'] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} className="h-3 rounded-full bg-[var(--muted)]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }} className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Keyword match</div>
                <div className="mt-1 text-lg font-black text-[var(--foreground)]">High</div>
              </motion.div>
              <motion.div animate={{ y: [0, 2, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Readability</div>
                <div className="mt-1 text-lg font-black text-[var(--foreground)]">Clear</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
];

const AnimatedPersona = () => {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveScene((current) => (current + 1) % scenes.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[activeScene];

  return (
    <div className="relative mx-auto w-full max-w-[360px] select-none sm:max-w-[420px] lg:max-w-[460px]" aria-hidden>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl sm:p-5"
      >
        <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-teal-400/10 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">Live preview</div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-[10px] font-bold">Auto rotate</div>
        </div>

        <div className="relative mt-4 min-h-[300px] overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background),var(--card))] p-4 sm:min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative h-full"
            >
              {scene.render()}
            </motion.div>
          </AnimatePresence>

        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          {scenes.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveScene(index)}
              className={`h-2 rounded-full transition-all ${activeScene === index ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--muted)]'}`}
              aria-label={item.title}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedPersona;
