import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { BUNDLE_PRICE } from '../config/pricing';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

type PaymentContextType = {
  hasPaid: boolean;
  handlePayment: (finalAmount?: number, couponCode?: string, discountAmount?: number, guestEmail?: string | null, guestPhone?: string | null) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [hasPaid, setHasPaid] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (user?.uid) {
        try {
          const collectionName = user!.role === 'admin' ? 'admins' : 'users';
          const userDoc = await getDoc(doc(db, collectionName, user!.uid));
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

  const handlePayment = async (finalAmount: number = BUNDLE_PRICE, couponCode?: string, discountAmount?: number, guestEmail?: string | null, guestPhone?: string | null) => {
    const auth = getAuth();
    const buyerEmail = user?.email || guestEmail || null;
    const buyerPhone = guestPhone || null;

    if (!user && !guestEmail) {
      toast.error('Please provide an email to receive access after payment.');
      return;
    }

    if (finalAmount <= 0) {
      if (!user) {
        toast.error('Sign in required to claim this free discount.');
        return;
      }
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

      // 2. Create Order on Backend (including buyer contact so server can create account)
      const orderData = await fetch('/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount * 100, email: buyerEmail, phone: buyerPhone }) // paise
      }).then(t => t.json());

      if (!orderData || !(orderData.id || orderData.order_id)) {
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
        order_id: orderData.id || orderData.order_id,
        handler: async function (response: any) {
          toast.loading('Verifying payment...', { id: toastId });
            try {
            // 4. Verify Signature on Backend (use function rewrite path)
            const verifyRes = await fetch('/verifyPayment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                uid: user?.uid || null,
                email: buyerEmail,
                phone: buyerPhone,
                amount: finalAmount
              })
            }).then(t => t.json());

            if (verifyRes && verifyRes.success) {
              // If logged-in user, update their document locally
              if (user && user.uid) {
                const collectionName = user.role === 'admin' ? 'admins' : 'users';
                await updateDoc(doc(db, collectionName, user.uid), {
                  hasPaid: true,
                  accessGrantedBy: 'user_payment',
                  amountPaid: finalAmount,
                  usedCoupon: couponCode || null,
                  discountReceived: discountAmount || 0
                });
                setHasPaid(true);
                toast.success(`Payment Successful! ₹${BUNDLE_PRICE} Ultimate Bundle Unlocked.`, { id: toastId });
              } else {
                // Guest flow: server created the Auth user and user document; prompt password reset email
                toast.success(`Payment Successful! Access will be sent to ${buyerEmail}`, { id: toastId });
                try {
                  if (buyerEmail) {
                    await sendPasswordResetEmail(auth, buyerEmail);
                    toast.success(`Password setup email sent to ${buyerEmail}`);
                  }
                } catch (err) {
                  console.error('sendPasswordResetEmail error', err);
                  toast('Unable to send password email automatically. Please check your inbox or contact support.');
                }
              }
            } else {
              toast.error('Payment verification failed.', { id: toastId });
            }
          } catch (error) {
            console.error(error);
            toast.error('Payment verified but failed to update status.', { id: toastId });
          }
        },
        prefill: {
          name: user?.name || "Candidate",
          email: buyerEmail || "",
          contact: buyerPhone || ''
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
