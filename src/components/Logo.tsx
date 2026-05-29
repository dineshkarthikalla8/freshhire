import React from 'react';

export const Logo: React.FC<{ className?: string; alt?: string }> = ({ className = '', alt = 'FreshHire logo' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 ring-1 ring-white/10" aria-label={alt}>
        <span className="text-sm sm:text-base font-black tracking-tight">FH</span>
      </div>
      <div className="leading-none hidden sm:block">
        <div className="font-black text-lg text-[var(--foreground)] tracking-tight">FreshHire</div>
        <div className="text-xs text-[var(--muted-foreground)] -mt-0.5">ATS + Interview prep</div>
      </div>
    </div>
  );
};

export default Logo;
