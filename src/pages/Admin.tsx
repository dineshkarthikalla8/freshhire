import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';

export const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number | ''>('');
  const [generatingCoupon, setGeneratingCoupon] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchUsersAndCoupons = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        const fetchedAdmins = adminsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUsers([...fetchedAdmins, ...fetchedUsers]);

        const couponSnapshot = await getDocs(collection(db, 'coupons'));
        setCoupons(couponSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndCoupons();
  }, [user]);

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleTogglePremium = async (userId: string, currentStatus: boolean, userRole: string) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setUsers(users.map(u => u.id === userId ? { ...u, hasPaid: newStatus, accessGrantedBy: newStatus ? 'admin' : null } : u));
    
    try {
      const collectionName = userRole === 'admin' ? 'admins' : 'users';
      await updateDoc(doc(db, collectionName, userId), {
        hasPaid: newStatus,
        accessGrantedBy: newStatus ? 'admin' : null
      });
      toast.success(newStatus ? 'Premium plan granted!' : 'Premium plan revoked.');
    } catch (error) {
      console.error("Error updating user:", error);
      // Revert on error
      setUsers(users.map(u => u.id === userId ? { ...u, hasPaid: currentStatus } : u));
      toast.error('Failed to update premium status.');
    }
  };

  const handleDeleteUser = async (userId: string, userRole: string) => {
    if (!window.confirm("Are you sure you want to completely remove this user data? This cannot be undone.")) return;
    
    const toastId = toast.loading('Deleting user...');
    try {
      const collectionName = userRole === 'admin' ? 'admins' : 'users';
      await deleteDoc(doc(db, collectionName, userId));
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User removed successfully.', { id: toastId });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user.', { id: toastId });
    }
  };

  const handleGenerateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    
    setGeneratingCoupon(true);
    const code = newCouponCode.toUpperCase().trim();
    try {
      const couponRef = doc(db, 'coupons', code);
      const newCoupon = {
        code,
        discountAmount: Number(newCouponDiscount),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      await setDoc(couponRef, newCoupon);
      
      setCoupons([...coupons, { id: code, ...newCoupon }]);
      setNewCouponCode('');
      setNewCouponDiscount('');
      toast.success('Coupon generated successfully!');
    } catch (err) {
      toast.error('Failed to generate coupon');
    } finally {
      setGeneratingCoupon(false);
    }
  };

  const handleToggleCoupon = async (couponId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), { isActive: !currentStatus });
      setCoupons(coupons.map(c => c.id === couponId ? { ...c, isActive: !currentStatus } : c));
      toast.success(currentStatus ? 'Coupon disabled' : 'Coupon enabled');
    } catch (err) {
      toast.error('Failed to update coupon');
    }
  };

  const totalRegistered = users.length;
  const organicPaid = users.filter(u => u.hasPaid && u.accessGrantedBy === 'user_payment').length;
  const adminGranted = users.filter(u => u.hasPaid && u.accessGrantedBy === 'admin').length;
  const totalIncome = organicPaid * 35;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h2 className="text-4xl font-black text-[var(--foreground)] tracking-tight">
              {user ? `Welcome, ${user.name}` : 'Admin Dashboard'}
            </h2>
            <p className="text-[var(--muted-foreground)] font-medium mt-2">Manage users, view analytics, and grant premium access.</p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Total Users</span>
            </div>
            <div className="text-4xl font-black text-[var(--foreground)]">{loading ? '-' : totalRegistered}</div>
          </div>
          
          <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Organic Sales</span>
            </div>
            <div className="text-4xl font-black text-[var(--foreground)]">{loading ? '-' : organicPaid}</div>
          </div>

          <div className="bg-gradient-to-br from-[var(--primary)]/10 to-teal-400/10 border border-[var(--primary)]/20 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">Revenue</span>
            </div>
            <div className="text-4xl font-black text-[var(--foreground)]">{loading ? '-' : `₹${totalIncome}`}</div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Admin Granted</span>
            </div>
            <div className="text-4xl font-black text-[var(--foreground)]">{loading ? '-' : adminGranted}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Coupon Generator */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-xl lg:col-span-1 flex flex-col">
            <h3 className="text-xl font-bold mb-6">Create Coupon</h3>
            <form onSubmit={handleGenerateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Coupon Code</label>
                <input 
                  type="text" 
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. FRESH10" 
                  required
                  className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] uppercase font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Discount Amount (₹)</label>
                <input 
                  type="number" 
                  min="1"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  placeholder="10" 
                  required
                  className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                />
              </div>
              <button 
                type="submit"
                disabled={generatingCoupon || !newCouponCode || !newCouponDiscount}
                className="w-full py-3 rounded-xl font-bold bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 disabled:opacity-50 transition-colors mt-2"
              >
                {generatingCoupon ? 'Generating...' : 'Generate Coupon'}
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-xl lg:col-span-2 overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-6">Active Coupons</h3>
            <div className="flex-1 overflow-y-auto min-h-[200px]">
              {coupons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[var(--muted-foreground)] font-medium">
                  No coupons generated yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between p-4 border border-[var(--border)] rounded-xl bg-[var(--background)]">
                      <div>
                        <div className="font-black text-lg tracking-widest text-[var(--foreground)]">{coupon.code}</div>
                        <div className="text-xs font-bold text-green-500 mt-1">₹{coupon.discountAmount} OFF</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${coupon.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'}`}>
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <button 
                          onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                          className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${coupon.isActive ? 'bg-[var(--success)]' : 'bg-[var(--muted-foreground)]/30'}`}
                        >
                          <span className="sr-only">Toggle Coupon</span>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <svg className="animate-spin h-8 w-8 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted-foreground)] font-medium">No users found.</div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs uppercase tracking-wider font-bold">
                    <th className="p-6 border-b border-[var(--border)]">User</th>
                    <th className="p-6 border-b border-[var(--border)]">Email</th>
                    <th className="p-6 border-b border-[var(--border)]">Role</th>
                    <th className="p-6 border-b border-[var(--border)] text-right">Premium Access</th>
                    <th className="p-6 border-b border-[var(--border)] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((u, i) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      <td className="p-6">
                        <div 
                          className="font-bold text-[var(--foreground)] cursor-pointer hover:text-[var(--primary)] transition-colors inline-block"
                          onClick={() => setSelectedUser(u)}
                          title="View Details"
                        >
                          {u.name || 'N/A'}
                        </div>
                        <div className="text-[10px] text-[var(--muted-foreground)] font-mono mt-1">ID: {u.id.substring(0,8)}...</div>
                      </td>
                      <td className="p-6 text-[var(--muted-foreground)] font-medium">{u.email}</td>
                      <td className="p-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={() => handleTogglePremium(u.id, !!u.hasPaid, u.role)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] ${
                              u.hasPaid ? 'bg-[var(--success)]' : 'bg-[var(--muted-foreground)]/30'
                            }`}
                          >
                            <span className="sr-only">Toggle Premium</span>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                u.hasPaid ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          
                          {u.hasPaid ? (
                            u.accessGrantedBy === 'admin' ? (
                              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                                NOT PAID, ACCESS GIVEN BY ADMIN
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">
                                PAID, ACCESS GIVEN
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wide">
                              NOT PAID, NO ACCESS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.role)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center mx-auto"
                          title="Delete User"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h3 className="text-2xl font-black mb-6 border-b border-[var(--border)] pb-4">User Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Name</div>
                <div className="font-bold text-lg">{selectedUser.name || 'N/A'}</div>
              </div>
              
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Email</div>
                <div className="font-medium">{selectedUser.email}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Role</div>
                  <div className="capitalize font-medium">{selectedUser.role || 'user'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</div>
                  <div className="font-medium text-green-500">{selectedUser.hasPaid ? 'Premium' : 'Free'}</div>
                </div>
              </div>

              {selectedUser.hasPaid && (
                <div className="bg-[var(--muted)] p-4 rounded-xl mt-4 space-y-3 border border-[var(--border)]">
                  <h4 className="text-sm font-black uppercase tracking-wider">Payment Info</h4>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-[var(--muted-foreground)] font-bold">Access By:</span>
                    <span className="text-sm font-bold uppercase">{selectedUser.accessGrantedBy || 'N/A'}</span>
                  </div>

                  {selectedUser.usedCoupon && (
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--muted-foreground)] font-bold">Coupon Used:</span>
                      <span className="text-sm font-black text-[var(--primary)]">{selectedUser.usedCoupon}</span>
                    </div>
                  )}

                  {selectedUser.discountReceived > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-[var(--muted-foreground)] font-bold">Discount:</span>
                      <span className="text-sm font-bold text-green-500">₹{selectedUser.discountReceived} OFF</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-[var(--border)] pt-2 mt-2">
                    <span className="text-sm text-[var(--muted-foreground)] font-bold">Amount Paid:</span>
                    <span className="text-sm font-black">₹{selectedUser.amountPaid !== undefined ? selectedUser.amountPaid : (selectedUser.accessGrantedBy === 'user_payment' ? 35 : 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
