import React from 'react';
import logo from '../assets/fh-logo.png';

export const Logo: React.FC<{ className?: string; alt?: string }> = ({ className = '', alt = 'FreshHire logo' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={logo} alt={alt} className="h-20 w-20 rounded-none object-contain block" />
      <div className="leading-none">
        <div className="font-black text-lg text-[var(--foreground)] tracking-tight">FreshHire</div>
        <div className="text-xs text-[var(--muted-foreground)] -mt-0.5">ATS + Interview prep</div>
      </div>
    </div>
  );
};

export default Logo;
