import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

type PaymentContextType = {
  hasPaid: boolean;
  handlePayment: () => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [hasPaid, setHasPaid] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // The entire application is now free.
    setHasPaid(true);
  }, [user]);

  const handlePayment = () => {
    setHasPaid(true);
    toast.success('Access is free. Your bundle is already unlocked.');
  };

  return (
    <PaymentContext.Provider value={{ hasPaid, handlePayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
