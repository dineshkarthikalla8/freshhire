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

    const toastId = toast.loading('Initializing Secure Payment Gateway...');
    
    try {
      // 1. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?', { id: toastId });
        return;
      }

      // 2. Create Order on Backend
      const orderData = await fetch('http://localhost:8000/api/v1/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount * 100 }) // paise
      }).then(t => t.json());

      if (!orderData || !orderData.order_id) {
        toast.error('Failed to create order on server.', { id: toastId });
        return;
      }

      // 3. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Enter the Key ID generated from the Dashboard
        amount: (finalAmount * 100).toString(), 
        currency: "INR",
        name: "FreshHire ATS",
        description: "Ultimate Bundle Access",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          toast.loading('Verifying payment...', { id: toastId });
          try {
            // 4. Verify Signature on Backend
            const verifyRes = await fetch('http://localhost:8000/api/v1/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            }).then(t => t.json());

            if (verifyRes.status === 'success') {
              // 5. Update Firestore on successful verification
              const collectionName = user.role === 'admin' ? 'admins' : 'users';
              await updateDoc(doc(db, collectionName, user.uid), {
                hasPaid: true,
                accessGrantedBy: 'user_payment',
                amountPaid: finalAmount,
                usedCoupon: couponCode || null,
                discountReceived: discountAmount || 0
              });
              setHasPaid(true);
              toast.success('Payment Successful! ₹35 Ultimate Bundle Unlocked.', { id: toastId });
            } else {
              toast.error('Payment verification failed.', { id: toastId });
            }
          } catch (error) {
            console.error(error);
            toast.error('Payment verified but failed to update status.', { id: toastId });
          }
        },
        prefill: {
          name: user.name || "Candidate",
          email: user.email || "candidate@example.com",
        },
        theme: {
          color: "#000000"
        }
      };

      toast.dismiss(toastId);
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        toast.error(response.error.description);
      });
      paymentObject.open();

    } catch (error) {
      toast.error('Failed to initiate payment.', { id: toastId });
      console.error(error);
    }
  };

  // Helper to dynamically load script
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
