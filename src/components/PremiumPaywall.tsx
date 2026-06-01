import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface PremiumPaywallProps {
  user: any;
  refreshUser: () => Promise<void>;
  originalPrice: number;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PremiumPaywall = ({ user, refreshUser, originalPrice }: PremiumPaywallProps) => {
  const [paying, setPaying] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);

  const price = appliedCoupon
    ? Math.max(0, originalPrice - appliedCoupon.discount)
    : originalPrice;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setVerifyingCoupon(true);
      const codeId = couponCode.trim().toUpperCase();
      const docRef = doc(db, 'coupons', codeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        if (data.isActive) {
          setAppliedCoupon({
            code: codeId,
            discount: Number(data.discountAmount) || 0
          });
          toast.success(`Coupon "${codeId}" applied! ₹${data.discountAmount} discount.`);
        } else {
          toast.error('This coupon is currently inactive.');
        }
      } else {
        toast.error('Invalid coupon code.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to verify coupon.');
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePayment = async () => {
    if (!user) return;

    if (price === 0) {
      try {
        setPaying(true);
        const targetCol = user.role === 'admin' ? 'admins' : 'users';
        const userRef = doc(db, targetCol, user.uid);
        await setDoc(userRef, {
          hasPaid: true,
          accessGrantedBy: appliedCoupon ? `coupon_${appliedCoupon.code.toLowerCase()}` : 'payment_free_coupon',
          amountPaid: 0,
          paidAt: new Date().toISOString()
        }, { merge: true });

        await refreshUser();
        toast.success('Premium access unlocked successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to unlock. Please try again.');
      } finally {
        setPaying(false);
      }
      return;
    }

    try {
      setPaying(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        setPaying(false);
        return;
      }

      const amountInPaise = price * 100;
      const orderRes = await fetch('http://127.0.0.1:8000/api/v1/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise })
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order on backend.');
      }

      const orderData = await orderRes.json();
      const orderId = orderData.order_id;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SvvyejImtMy1i2',
        amount: amountInPaise,
        currency: 'INR',
        name: 'FreshHire',
        description: 'Premium Lifetime Pass Unlock',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            setPaying(true);

            const verifyRes = await fetch('http://127.0.0.1:8000/api/v1/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification signature check failed.');
            }

            const targetCol = user.role === 'admin' ? 'admins' : 'users';
            const userRef = doc(db, targetCol, user.uid);
            await setDoc(userRef, {
              hasPaid: true,
              accessGrantedBy: appliedCoupon ? `coupon_${appliedCoupon.code.toLowerCase()}` : 'payment_razorpay',
              amountPaid: price,
              paidAt: new Date().toISOString(),
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id
            }, { merge: true });

            await refreshUser();
            toast.success('Payment Successful! Premium access unlocked.');
          } catch (err) {
            console.error('Verification failed', err);
            toast.error('Payment verification failed.');
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || ''
        },
        theme: {
          color: '#0d9488'
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment. Ensure backend is running.');
      setPaying(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Immersive glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 opacity-25 blur-[120px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)] to-amber-500 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <FiLock className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
            Fresh<span className="text-[var(--primary)]">Hire</span> Premium
          </h2>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Platform is currently in **Paid Mode**. Access the complete preparation pathways, mock exams, resume scanners, and student experiences.
          </p>
        </div>

        {/* Test if the user needs to login first */}
        {!user ? (
          <div className="mt-8 text-center space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">Login Required</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                You must have an account to buy or apply coupons and access Premium content permanently.
              </p>
            </div>
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-2xl bg-[var(--primary)] py-4 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition hover:-translate-y-0.5 hover:shadow-[var(--primary)]/45"
            >
              Sign In to Unlock
            </Link>
          </div>
        ) : (
          <>
            {/* Price Card */}
            <div className="mt-8 rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/5 to-transparent p-6 text-center shadow-inner">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">One-Time Lifetime Pass</p>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                {appliedCoupon ? (
                  <>
                    <span className="text-4xl font-extrabold text-[var(--foreground)]">₹{price}</span>
                    <span className="text-sm font-semibold line-through text-[var(--muted-foreground)]">₹{originalPrice}</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-[var(--foreground)]">₹{originalPrice}</span>
                )}
                <span className="text-sm text-[var(--muted-foreground)]">/ lifetime</span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">No monthly fees. Access everything forever.</p>
            </div>

            {/* Feature List */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Curated DSA Practice Pathway',
                'Full Aptitude prep & Reasoning tests',
                'PDF-only ATS Resume Scanner',
                'Company-specific Mock Exams',
                'Student Interview Experiences',
                'Dynamic Performance tracking',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                    <FiCheck className="h-3 w-3" />
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-4">
                  <div className="text-left">
                    <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Coupon Applied</p>
                    <p className="text-sm font-black mt-0.5 text-[var(--foreground)]">
                      {appliedCoupon.code} <span className="font-semibold text-[var(--muted-foreground)]">(-₹{appliedCoupon.discount})</span>
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="PROMO CODE / COUPON"
                    disabled={verifyingCoupon}
                    className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-xs uppercase font-bold tracking-widest outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    type="submit"
                    disabled={verifyingCoupon || !couponCode.trim()}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:bg-[var(--muted)] disabled:opacity-50 cursor-pointer"
                  >
                    {verifyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-4 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition hover:-translate-y-0.5 hover:shadow-[var(--primary)]/45 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying ? 'Processing Secure Payment...' : price === 0 ? 'Unlock Premium for Free' : `Pay ₹${price} & Unlock Access`}
              </button>
              <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
                🔒 Simulated secure payment environment. Unlocks your account instantly.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
