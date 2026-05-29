import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader, FiShield } from 'react-icons/fi';

export type TransactionState = 'idle' | 'initiating' | 'processing' | 'verifying' | 'success' | 'error';

interface AnimatedTransactionProps {
  state: TransactionState;
}

export const AnimatedTransaction = ({ state }: AnimatedTransactionProps) => {
  if (state === 'idle') return null;

  const contentMap = {
    initiating: {
      icon: <FiShield className="w-16 h-16 text-[var(--foreground)] animate-pulse" />,
      title: 'Securing Connection',
      description: 'Preparing your secure payment gateway...',
      color: 'var(--foreground)',
    },
    processing: {
      icon: <FiLoader className="w-16 h-16 text-[var(--foreground)] animate-spin" />,
      title: 'Awaiting Payment',
      description: 'Please complete the payment in the Razorpay window.',
      color: 'var(--foreground)',
    },
    verifying: {
      icon: <FiLoader className="w-16 h-16 text-[var(--foreground)] animate-spin" />,
      title: 'Verifying Payment',
      description: 'Confirming transaction with the bank...',
      color: 'var(--foreground)',
    },
    success: {
      icon: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <FiCheckCircle className="w-20 h-20 text-[var(--primary)]" />
        </motion.div>
      ),
      title: 'Payment Successful!',
      description: 'Your Ultimate Bundle is now unlocked.',
      color: '#e11d48',
    },
    error: {
      icon: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <FiXCircle className="w-20 h-20 text-red-500" />
        </motion.div>
      ),
      title: 'Transaction Failed',
      description: 'Something went wrong. Please try again.',
      color: '#ef4444', // red-500
    },
  };

  const currentContent = contentMap[state as keyof typeof contentMap];

  if (!currentContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Glassmorphism Backdrop */}
        <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative z-10 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Subtle background glow based on state color */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] opacity-20 rounded-full"
            style={{ backgroundColor: currentContent.color }}
          />

          <div className="relative mb-6">
            {currentContent.icon}
          </div>

          <h3 className="text-2xl font-black mb-2 text-[var(--foreground)]">
            {currentContent.title}
          </h3>
          <p className="text-[var(--muted-foreground)] text-sm font-medium">
            {currentContent.description}
          </p>

          {/* Progress Indicator for loading states */}
          {(state === 'initiating' || state === 'processing' || state === 'verifying') && (
            <div className="mt-8 w-full h-1 bg-[var(--muted)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--foreground)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: state === 'initiating' ? 1.5 : state === 'verifying' ? 2 : 10,
                  ease: 'easeInOut',
                  repeat: state === 'processing' ? Infinity : 0
                }}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
