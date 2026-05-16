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
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Hero Section */}
      <div className="w-full max-w-[1400px] px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm font-bold text-[var(--foreground)] mb-8 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_10px_var(--success)]" />
            FreshHire 2.0 is Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-black text-[var(--foreground)] leading-[1.05] tracking-tighter mb-8"
          >
            Bypass the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-teal-400 to-[var(--primary)] animate-gradient-x">ATS Filters.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--muted-foreground)] font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            The enterprise-grade platform to perfectly score your resume against strict job descriptions and master top-tier DSA interviews.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white font-black text-lg rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
              Start Scanning Free
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/dsa" className="w-full sm:w-auto px-8 py-4 bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] font-bold text-lg rounded-xl hover:bg-[var(--muted)] hover:border-[var(--muted-foreground)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-sm">
              View DSA Pathway
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 w-full relative z-10">
          <AnimatedLaptop />
          
          {/* Floating Badges */}
          <motion.div 
            initial={{ y: 50, opacity: 0, rotate: -5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="absolute top-10 -left-10 bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-4 cursor-default"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-teal-400 text-white rounded-xl flex items-center justify-center font-black shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">Starting at</p>
              <p className="font-black text-xl text-[var(--foreground)]">₹35 Bundle</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee Section */}
      <div className="w-full py-12 border-y border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm overflow-hidden flex relative z-10">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />
        
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap items-center gap-20 px-8"
        >
          {/* Duplicated for smooth scrolling */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Google</span>
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Amazon</span>
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Meta</span>
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Netflix</span>
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Apple</span>
              <span className="text-3xl font-black text-[var(--foreground)] opacity-20 hover:opacity-100 transition-opacity cursor-default">Microsoft</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modern Bento Grid Features */}
      <div className="w-full max-w-[1400px] px-6 py-32 z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight mb-6"
          >
            Everything you need.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--muted-foreground)] font-medium max-w-2xl mx-auto"
          >
            Built specifically to help you land the interview and pass the technical rounds.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]"
        >
          
          {/* Bento Box 1: Large Feature */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-[var(--card)] to-[var(--muted)] border border-[var(--border)] rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
            <div className="relative z-10">
              <h3 className="text-4xl font-black mb-4 text-[var(--foreground)]">Deep AI Scanning</h3>
              <p className="text-[var(--muted-foreground)] text-lg font-medium max-w-sm leading-relaxed">We use advanced NLP to extract every keyword, skill, and metric from your PDF.</p>
            </div>
            <div className="absolute right-[-10%] bottom-[-20%] w-[50%] h-[120%] bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl rotate-12 group-hover:rotate-6 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
               <div className="w-32 h-32 rounded-full border-[8px] border-[var(--primary)] border-t-transparent animate-spin" />
            </div>
          </motion.div>

          {/* Bento Box 2 */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-[var(--primary)] to-indigo-700 text-white rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1 duration-300">
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 blur-3xl rounded-full" />
            <h3 className="text-4xl font-black relative z-10 leading-tight">₹35<br/>Bundle</h3>
            <p className="text-sm font-medium opacity-90 relative z-10 leading-relaxed mt-4">Unlock premium resume rewrites and the complete DSA tracking pathway instantly.</p>
          </motion.div>

          {/* Bento Box 3 */}
          <motion.div variants={itemVariants} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
             <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 text-[var(--foreground)]">Role Based</h3>
              <p className="text-[var(--muted-foreground)] font-medium text-sm leading-relaxed">Don't have a JD? We use strict baseline scoring for roles like Software Engineer.</p>
            </div>
            <div className="w-full flex gap-2 mt-6">
              <div className="h-3 flex-1 bg-[var(--success)] rounded-full shadow-[0_0_10px_var(--success)]" />
              <div className="h-3 flex-[2] bg-[var(--muted)] rounded-full border border-[var(--border)]" />
            </div>
          </motion.div>

          {/* Bento Box 4: Large Feature */}
          <motion.div variants={itemVariants} className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 text-[var(--foreground)]">Top 150 DSA</h3>
              <p className="text-[var(--muted-foreground)] text-lg font-medium max-w-sm leading-relaxed">A highly curated list of algorithmic challenges directly linking to LeetCode and GFG.</p>
            </div>
            <div className="absolute right-10 bottom-10 w-56 space-y-4 group-hover:translate-x-2 transition-transform duration-500">
              <div className="w-full h-8 bg-gradient-to-r from-[var(--primary)] to-transparent rounded-md opacity-20" />
              <div className="w-5/6 h-8 bg-gradient-to-r from-[var(--primary)] to-transparent rounded-md opacity-40" />
              <div className="w-full h-8 bg-gradient-to-r from-[var(--primary)] to-transparent rounded-md opacity-60" />
              <div className="w-4/6 h-8 bg-gradient-to-r from-[var(--primary)] to-transparent rounded-md opacity-80" />
            </div>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
};
