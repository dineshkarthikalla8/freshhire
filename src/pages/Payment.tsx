import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

export const Payment = () => {
  const navigate = useNavigate();
  const { handlePayment, hasPaid } = usePayment();
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const finalAmount = Math.max(0, 29 - discount);

  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setApplyingCoupon(true);
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('isActive', '==', true));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        toast.error('Invalid or expired coupon code');
        setDiscount(0);
      } else {
        const couponData = snapshot.docs[0].data();
        setDiscount(couponData.discountAmount);
        toast.success(`Coupon applied! ₹${couponData.discountAmount} off.`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  useEffect(() => {
    if (hasPaid) {
      navigate('/dashboard');
    }
  }, [hasPaid, navigate]);

  const onPayClick = async () => {
    await handlePayment(finalAmount, couponCode, discount);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-0 border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl bg-[var(--card)]"
      >
        {/* Left Side: Value Proposition */}
        <div className="p-12 bg-[var(--muted)] flex flex-col justify-center border-r border-[var(--border)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--foreground)] opacity-5 blur-[100px] rounded-full"></div>
          
          <h2 className="text-3xl font-black mb-6">Unlock the Ultimate FreshHire Bundle</h2>
          
          <ul className="space-y-6 mb-8 relative z-10">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4 className="font-bold">Deep Resume Insights</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Actionable AI feedback to pass the ATS parser.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4 className="font-bold">Top 150 DSA Tracking</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Full access to the curated pathway with GFG/LeetCode links.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h4 className="font-bold">Special Agents Pack</h4>
                <p className="text-sm text-[var(--muted-foreground)]">Custom cover letter generation tools.</p>
              </div>
            </li>
          </ul>

          <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] shadow-sm relative z-10">
            <p className="text-sm italic font-medium text-[var(--muted-foreground)]">"Paid ₹29 and fixed my resume. Got shortlisted at Microsoft the next week. The DSA tracker is also highly focused."</p>
            <p className="text-xs font-bold mt-2">— Sneha R., SDE-1</p>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="p-12 flex flex-col justify-center bg-[var(--card)] relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Checkout</h3>
            <div className="text-right">
              {discount > 0 && <div className="text-sm text-[var(--muted-foreground)] line-through">₹29</div>}
              <span className="text-3xl font-black">₹{finalAmount}</span>
            </div>
          </div>
          
          {/* Coupon Code Section */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Have a Coupon?</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Code" 
                className="flex-1 p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow uppercase font-bold"
                disabled={discount > 0}
              />
              {discount > 0 ? (
                <button onClick={() => {setDiscount(0); setCouponCode('');}} className="px-4 py-3 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  Remove
                </button>
              ) : (
                <button onClick={applyCoupon} disabled={applyingCoupon || !couponCode} className="px-6 py-3 rounded-xl font-bold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 disabled:opacity-50 transition-colors">
                  {applyingCoupon ? '...' : 'Apply'}
                </button>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-[var(--muted)] rounded-xl mb-8">
            {(['upi', 'card', 'netbanking'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  method === m ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-8 min-h-[140px]">
            {method === 'card' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Card Information</label>
                  <div className="border border-[var(--border)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--foreground)] transition-shadow">
                    <input type="text" placeholder="Card Number" className="w-full p-4 border-b border-[var(--border)] bg-transparent focus:outline-none" />
                    <div className="flex">
                      <input type="text" placeholder="MM / YY" className="w-1/2 p-4 border-r border-[var(--border)] bg-transparent focus:outline-none" />
                      <input type="text" placeholder="CVC" className="w-1/2 p-4 bg-transparent focus:outline-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'upi' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">UPI ID / VPA</label>
                  <input type="text" placeholder="username@upi" className="w-full p-4 border border-[var(--border)] rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow" />
                </div>
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="px-3 py-1.5 border border-[var(--border)] rounded-md text-xs font-bold text-[var(--muted-foreground)]">GPay</div>
                  <div className="px-3 py-1.5 border border-[var(--border)] rounded-md text-xs font-bold text-[var(--muted-foreground)]">PhonePe</div>
                  <div className="px-3 py-1.5 border border-[var(--border)] rounded-md text-xs font-bold text-[var(--muted-foreground)]">Paytm</div>
                </div>
              </motion.div>
            )}

            {method === 'netbanking' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Select Bank</label>
                  <select className="w-full p-4 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow appearance-none">
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          <button 
            onClick={onPayClick}
            className="w-full py-5 rounded-xl font-black text-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity shadow-xl flex items-center justify-center gap-2 mt-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {finalAmount > 0 ? `Pay ₹${finalAmount} Securely` : 'Unlock for Free'}
          </button>
          
          <p className="text-center text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-widest mt-6 flex justify-center gap-4">
            <span>Secured by Razorpay</span>
            <span>256-bit Encryption</span>
          </p>
        </div>

      </motion.div>
    </div>
  );
};
