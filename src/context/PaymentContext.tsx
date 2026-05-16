import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

type PaymentContextType = {
  hasPaid: boolean;
  handlePayment: (finalAmount?: number, couponCode?: string, discountAmount?: number) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [hasPaid, setHasPaid] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (user?.uid) {
        try {
          const collectionName = user.role === 'admin' ? 'admins' : 'users';
          const userDoc = await getDoc(doc(db, collectionName, user.uid));
          if (userDoc.exists() && userDoc.data().hasPaid) {
            setHasPaid(true);
          } else {
            setHasPaid(false);
          }
        } catch (error) {
          console.error("Error fetching payment status:", error);
        }
      } else {
        setHasPaid(false);
      }
    };
    
    fetchPaymentStatus();
  }, [user]);

  const handlePayment = async (finalAmount: number = 35, couponCode?: string, discountAmount?: number) => {
    if (!user) {
      toast.error('You must be logged in to make a payment.');
      return;
    }

    if (finalAmount <= 0) {
      const toastId = toast.loading('Applying 100% discount...');
      try {
        const collectionName = user.role === 'admin' ? 'admins' : 'users';
        await updateDoc(doc(db, collectionName, user.uid), {
          hasPaid: true,
          accessGrantedBy: 'coupon',
          amountPaid: 0,
          usedCoupon: couponCode || null,
          discountReceived: discountAmount || 0
        });
        setHasPaid(true);
        toast.success('Ultimate Bundle Unlocked for Free!', { id: toastId });
      } catch (error) {
        toast.error('Failed to apply discount.', { id: toastId });
      }
      return;
    }

    const toastId = toast.loading('Redirecting to Secure Payment Page...');
    
    try {
      const paymentUrl = import.meta.env.VITE_RAZORPAY_PAYMENT_PAGE_URL || 'https://rzp.io/rzp/tevf7OwT';
      window.open(paymentUrl, '_blank');
      
      toast.dismiss(toastId);
      toast.success('Payment page opened. Verifying transaction...', { duration: 3000 });
      
      // For MVP/Demo purposes: Simulate successful verification after opening the payment page
      // In a real production environment, this should be handled by Razorpay Webhooks
      setTimeout(async () => {
        try {
          const collectionName = user.role === 'admin' ? 'admins' : 'users';
          await updateDoc(doc(db, collectionName, user.uid), {
            hasPaid: true,
            accessGrantedBy: 'payment_page_redirect',
            amountPaid: finalAmount,
            usedCoupon: couponCode || null,
            discountReceived: discountAmount || 0
          });
          setHasPaid(true);
          toast.success('Payment Successful! ₹35 Ultimate Bundle Unlocked.', { duration: 5000 });
        } catch (updateError) {
          console.error("Failed to update payment status:", updateError);
        }
      }, 3000);

    } catch (error) {
      toast.error('Failed to open payment page.', { id: toastId });
      console.error(error);
    }
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
