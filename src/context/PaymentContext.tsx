import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import axios from 'axios';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

    const toastId = toast.loading('Loading payment gateway...');
    
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you offline?', { id: toastId });
        return;
      }

      toast.loading('Initializing secure payment...', { id: toastId });

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

      // 1. Create order on backend
      const { data } = await axios.post(`${API_BASE}/create-order`, {
        amount: finalAmount * 100 // amount in paise
      });

      toast.dismiss(toastId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Sq1QCgumJ6qpZE",
        amount: finalAmount * 100,
        currency: "INR",
        name: "FreshHire",
        description: "FreshHire Ultimate Bundle",
        order_id: data.order_id,
        handler: async function (response: any) {
            const verifyToast = toast.loading('Verifying payment...');
            try {
                // 2. Verify payment on backend
                const verifyRes = await axios.post(`${API_BASE}/verify-payment`, {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
                
                if (verifyRes.data.status === 'success') {
                    // 3. Update firestore
                    const collectionName = user.role === 'admin' ? 'admins' : 'users';
                    await updateDoc(doc(db, collectionName, user.uid), {
                      hasPaid: true,
                      accessGrantedBy: 'payment',
                      amountPaid: finalAmount,
                      usedCoupon: couponCode || null,
                      discountReceived: discountAmount || 0,
                      razorpay_payment_id: response.razorpay_payment_id
                    });
                    setHasPaid(true);
                    toast.success('Payment successful! Ultimate Bundle unlocked.', { id: verifyToast });
                } else {
                    toast.error('Payment verification failed. Please contact support.', { id: verifyToast });
                }
            } catch (err) {
                toast.error('Error verifying payment.', { id: verifyToast });
                console.error(err);
            }
        },
        prefill: {
            name: user.name || "",
            email: user.email || "",
            contact: ""
        },
        theme: {
            color: "#0d9488"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error('Failed to initiate payment.', { id: toastId });
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
