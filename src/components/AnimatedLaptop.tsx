import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export const AnimatedLaptop = () => {
  const [mode, setMode] = useState<'resume' | 'code'>('resume');
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse values
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  // Map mouse position to rotation angles (limited to subtle movements)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, 5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized mouse position from -0.5 to 0.5
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    // Reset to default perspective
    x.set(-0.2);
    y.set(0);
  };

  // Initial animation
  useEffect(() => {
    x.set(-0.2);
    y.set(0);
  }, [x, y]);

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-[800px] mt-20" 
      style={{ perspective: '1500px' }}
    >
      <motion.div 
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: 'preserve-3d' 
        }}
        className="relative shadow-[0_0_80px_rgba(255,255,255,0.1)] rounded-2xl transition-shadow duration-300 hover:shadow-[0_0_120px_rgba(255,255,255,0.15)]"
      >
        {/* Glow behind laptop */}
        <div className="absolute inset-0 bg-white/20 blur-[100px] opacity-20 -z-10 rounded-[3rem]" />
        
        {/* Laptop Screen - Forces dark theme for contrast */}
        <div className="relative bg-[#050505] rounded-t-[1.5rem] border-[10px] border-[#1f1f1f] shadow-2xl overflow-hidden aspect-[16/10] flex flex-col z-10 border-b-0">
          {/* Browser bar */}
          <div className="h-6 bg-[#1f1f1f] w-full flex items-center px-4 gap-2 shadow-sm border-b border-[#333]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <div className="ml-4 h-3 w-1/3 bg-[#333] rounded-full"></div>
          </div>
          
          {/* Screen Content - Toggle between Resume and Code views */}
          <div className="flex-1 bg-[#111111] p-8 relative overflow-hidden flex justify-center items-start">

             <div className="absolute top-4 right-6 z-30 flex items-center gap-2">
               <button onClick={() => setMode('resume')} className={`px-3 py-1 rounded-lg font-bold ${mode === 'resume' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]'}`}>Resume</button>
               <button onClick={() => setMode('code')} className={`px-3 py-1 rounded-lg font-bold ${mode === 'code' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)]'}`}>Code</button>
             </div>

             {/* Animated content switch */}
             <motion.div initial={false} animate={{ opacity: 1 }} className="w-full flex justify-center">
               <motion.div
                 key={mode}
                 initial={{ opacity: 0, scale: 0.98, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.45 }}
                 className="w-[85%] relative"
               >
                 {mode === 'resume' ? (
                     <div className="w-full bg-[#1a1a1a] shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#2a2a2a] p-8 flex flex-col gap-4 rounded-md relative z-0 mt-4">

                 {/* Resume Header */}
                 <div className="w-1/3 h-6 bg-[#333] rounded-md mb-2"></div>
                 <motion.div animate={{ backgroundColor: ['#2a2a2a', '#2b2b2b', '#2a2a2a'] }} transition={{ duration: 2.2, repeat: Infinity }} className="w-1/2 h-2.5 bg-[#2a2a2a] rounded-full" />
                 <div className="w-full h-[1px] bg-[#333] my-3"></div>

                 {/* Resume Section 1 with scanning highlights */}
                 <div className="w-1/4 h-4 bg-[#333] rounded-md mt-2"></div>
                 <motion.div animate={{ boxShadow: ['none', `0 0 18px rgba(255,122,0,0.25)`, 'none'], backgroundColor: ['#2a2a2a', '#331a00', '#2a2a2a'] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6 }} className="w-full h-2.5 bg-[#2a2a2a] rounded-full" />
                 <motion.div animate={{ boxShadow: ['none', `0 0 18px rgba(255,122,0,0.25)`, 'none'], backgroundColor: ['#2a2a2a', '#2f1600', '#2a2a2a'] }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.9 }} className="w-5/6 h-2.5 bg-[#2a2a2a] rounded-full" />
                 <motion.div animate={{ boxShadow: ['none', `0 0 18px rgba(255,122,0,0.25)`, 'none'], backgroundColor: ['#2a2a2a', '#311700', '#2a2a2a'] }} transition={{ duration: 2.0, repeat: Infinity, repeatDelay: 1.2 }} className="w-full h-2.5 bg-[#2a2a2a] rounded-full" />
                 <div className="w-4/6 h-2.5 bg-[#2a2a2a] rounded-full"></div>

                 {/* Resume Section 2 - with active scanning highlights */}
                 <div className="w-1/4 h-4 bg-[#333] rounded-md mt-6"></div>
                 <motion.div animate={{ backgroundColor: ['#2a2a2a', '#3a1a05', '#2a2a2a'] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-full h-2.5 rounded-full bg-[#2a2a2a]"></motion.div>
                 <div className="flex gap-3">
                    <motion.div 
                      animate={{ 
                        backgroundColor: ['#2a2a2a', '#ffdcb3', '#2a2a2a'],
                        boxShadow: ['none', `0 0 18px rgba(255,122,0,0.35)`, 'none']
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.3 }}
                      className="w-1/4 h-2.5 rounded-full" 
                    />
                    <motion.div 
                      animate={{ 
                        backgroundColor: ['#2a2a2a', '#ffdcb3', '#2a2a2a'],
                        boxShadow: ['none', `0 0 18px rgba(255,122,0,0.25)`, 'none']
                      }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6 }}
                      className="w-1/3 h-2.5 rounded-full" 
                    />
                 </div>

                 <div className="w-full h-[1px] bg-[#333] my-3"></div>
                 <div className="w-1/4 h-4 bg-[#333] rounded-md mt-2"></div>
                 <motion.div animate={{ backgroundColor: ['#2a2a2a', '#321800', '#2a2a2a'] }} transition={{ duration: 1.7, repeat: Infinity }} className="w-full h-2.5 rounded-full bg-[#2a2a2a]"></motion.div>
                 <div className="w-5/6 h-2.5 bg-[#2a2a2a] rounded-full"></div>
               </div>
                 ) : (
                   <div className="w-full bg-[#0b1220] shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#132035] p-6 rounded-md relative z-0 mt-4">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 bg-[#0ea5a1] rounded-md flex items-center justify-center font-bold text-black">JS</div>
                       <div className="text-sm text-[var(--muted-foreground)]">Live coding preview</div>
                     </div>
                     <div className="bg-[#071022] rounded-md p-4 text-[0.85rem] font-mono text-[var(--primary)]">
                       <pre className="whitespace-pre-wrap">{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
}
`}</pre>
                     </div>
                     <div className="mt-4 flex gap-2">
                       <div className="h-3 flex-1 bg-[#06202b] rounded-full" />
                       <div className="h-3 w-24 bg-[#06202b] rounded-full" />
                     </div>
                   </div>
                 )}
               </motion.div>
             </motion.div>

             {/* High-end Scanning Laser Effect */}
             <motion.div
               className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-[var(--primary)]/12 to-[var(--primary)]/20 border-b-2 border-[var(--primary)]/10 z-10 pointer-events-none mix-blend-screen"
               initial={{ y: -200 }}
               animate={{ y: 520 }}
               transition={{
                 duration: 1.6,
                 repeat: Infinity,
                 ease: "linear",
               }}
             >
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--primary)] shadow-[0_0_18px_rgba(255,122,0,0.85)]"></div>
             </motion.div>
             
             {/* ATS Score Floating Glassmorphism Widget */}
             <motion.div
               initial={{ scale: 0, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               transition={{ delay: 1.8, duration: 0.8, type: 'spring', bounce: 0.4 }}
               className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-xl shadow-2xl rounded-2xl p-5 border border-white/10 flex items-center gap-5 z-20"
               style={{ transform: 'translateZ(50px)' }}
             >
               <div className="relative">
                 <div className="absolute inset-0 bg-[var(--primary)] rounded-full blur-[14px] opacity-40"></div>
                 <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center text-[var(--primary)] font-extrabold text-2xl border-4 border-[var(--primary)]/40">
                   98%
                 </div>
               </div>
               <div className="text-left">
                 <div className="text-xs text-[#a1a1aa] font-bold uppercase tracking-widest mb-1">ATS Match</div>
                 <div className="text-lg font-bold text-white">Top Candidate</div>
               </div>
             </motion.div>
          </div>
        </div>
        
        {/* Laptop Keyboard Base - 3D depth */}
        <div className="relative w-[114%] -left-[7%] h-8 bg-gradient-to-b from-[#2a2a2a] to-[#111] rounded-b-[2rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8)] border-t border-[#444] flex items-start justify-center z-20" style={{ transform: 'translateZ(-1px)' }}>
          <div className="w-32 h-1.5 bg-[#444] rounded-b-xl mt-0 shadow-inner"></div>
        </div>
      </motion.div>
    </div>
  );
};
