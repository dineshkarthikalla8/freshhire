import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

type AnimatedTextProps = {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'p';
  variant?: 'shimmer' | 'pulse' | 'gradient' | 'glow' | 'typing';
};

export const AnimatedText = ({
  children,
  className = '',
  as: Tag = 'span',
  variant = 'gradient',
}: AnimatedTextProps) => {
  const text = String(children);
  const [typed, setTyped] = useState(variant === 'typing' ? '' : text);

  useEffect(() => {
    if (variant !== 'typing') return;
    setTyped('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [text, variant]);

  const base =
    variant === 'shimmer'
      ? 'text-gradient-red animate-shimmer bg-gradient-to-r from-[#ff6b6b] via-[var(--primary)] to-[#ff9999] bg-clip-text text-transparent'
      : variant === 'pulse' || variant === 'glow'
        ? 'text-glow-red'
        : variant === 'typing'
          ? 'text-glow-red'
          : 'text-gradient-red';

  const content = variant === 'typing' ? typed : children;

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      <Tag className={`${base} ${className}`}>
        {variant === 'pulse' || variant === 'glow' ? (
          <motion.span
            animate={
              variant === 'glow'
                ? { textShadow: ['0 0 12px rgba(229,9,20,0.4)', '0 0 28px rgba(229,9,20,0.9)', '0 0 12px rgba(229,9,20,0.4)'] }
                : { opacity: [1, 0.65, 1] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className={base}
          >
            {content}
          </motion.span>
        ) : (
          <span className={variant === 'typing' && typed.length < text.length ? 'animate-typing-cursor' : ''}>
            {content}
          </span>
        )}
      </Tag>
    </motion.span>
  );
};

export default AnimatedText;
