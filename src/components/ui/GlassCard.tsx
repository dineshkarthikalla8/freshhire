import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
};

export const GlassCard = ({ children, className = '', glow = false, delay = 0 }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`glass-card p-5 sm:p-6 ${glow ? 'glass-card-glow' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;
