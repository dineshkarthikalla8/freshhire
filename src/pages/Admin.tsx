import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminContentStudio } from '../components/admin/AdminContentStudio';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { storage } from '../config/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { db, hasValidFirebaseConfig } from '../config/firebase';

type TabId = 'overview' | 'members' | 'coupons' | 'experiences' | 'subscriptions' | 'content';

type MemberRecord = {
  id: string;
  uid?: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
  hasPaid?: boolean;
  accessGrantedBy?: string;
  amountPaid?: number;
};

type CouponRecord = {
  id: string;
  code?: string;
  discountAmount?: number;
  isActive?: boolean;
};

type ExperienceRecord = {
  id: string;
  name?: string;
  company?: string;
  year?: string;
  rounds?: string;
  hiringProcess?: string;
  description?: string;
  photoUrl?: string;
  status?: 'pending' | 'approved';
  createdAt?: any;
};

type SubscriptionRecord = {
  id: string;
  email?: string;
  userEmail?: string;
  uid?: string;
  status?: string;
  amount?: number;
};

export const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const activeTab: TabId = (hash.replace('#', '') as TabId) || 'overview';
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [memberQuery, setMemberQuery] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [experienceQuery, setExperienceQuery] = useState('');
  const [editingExperience, setEditingExperience] = useState<ExperienceRecord | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const loadData = async () => {
    if (!hasValidFirebaseConfig) return;

    setLoading(true);
    try {
      const [usersSnap, adminsSnap, couponsSnap, experiencesSnap, subscriptionsSnap, contentSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'admins')),
        getDocs(collection(db, 'coupons')),
        getDocs(collection(db, 'interviewExperiences')),
        getDocs(collection(db, 'subscriptions')),
        getDocs(collection(db, 'studyContent')),
      ]);

      const userMembers = usersSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object), role: 'user' as const }));
      const adminMembers = adminsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object), role: 'admin' as const }));

      setMembers([...adminMembers, ...userMembers]);
      setCoupons(couponsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
      setExperiences(experiencesSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
      setSubscriptions(subscriptionsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
      setContentCount(contentSnap.size);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = useMemo(() => {
    const activeCoupons = coupons.filter((item) => item.isActive).length;
    const approvedExperiences = experiences.filter((item) => item.status === 'approved').length;
    const pendingExperiences = experiences.length - approvedExperiences;
    const adminCount = members.filter((item) => item.role === 'admin').length;

    return {
      memberCount: members.length,
      adminCount,
      couponCount: coupons.length,
      activeCoupons,
      approvedExperiences,
      pendingExperiences,
      subscriptionCount: subscriptions.length,
      contentCount,
    };
  }, [contentCount, coupons, experiences, members, subscriptions]);

  const filteredMembers = useMemo(() => {
    const query = memberQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((item) => {
      return [item.name, item.email, item.role, item.accessGrantedBy]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [memberQuery, members]);

  const filteredExperiences = useMemo(() => {
    const query = experienceQuery.trim().toLowerCase();
    if (!query) return experiences;

    return experiences.filter((item) => {
      return [item.name, item.company, item.year, item.rounds, item.hiringProcess, item.description, item.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [experienceQuery, experiences]);

  const createCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!couponCode.trim() || couponDiscount <= 0) {
      toast.error('Enter a coupon code and a valid discount');
      return;
    }

    try {
      const couponId = couponCode.trim().toUpperCase();
      await setDoc(doc(db, 'coupons', couponId), {
        code: couponId,
        discountAmount: couponDiscount,
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      setCoupons((previous) => [{ id: couponId, code: couponId, discountAmount: couponDiscount, isActive: true }, ...previous]);
      setCouponCode('');
      setCouponDiscount(0);
      toast.success('Coupon created');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create coupon');
    }
  };

  const toggleCoupon = async (coupon: CouponRecord) => {
    try {
      const nextActive = !coupon.isActive;
      await updateDoc(doc(db, 'coupons', coupon.id), { isActive: nextActive });
      setCoupons((previous) => previous.map((item) => (item.id === coupon.id ? { ...item, isActive: nextActive } : item)));
      toast.success(nextActive ? 'Coupon activated' : 'Coupon disabled');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update coupon');
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      setCoupons((previous) => previous.filter((item) => item.id !== couponId));
      toast.success('Coupon deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete coupon');
    }
  };

  const promoteToAdmin = async (member: MemberRecord) => {
    const currentRole = member.role || 'user';
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    const targetDoc = doc(db, nextRole === 'admin' ? 'admins' : 'users', member.id);
    const removeDoc = doc(db, nextRole === 'admin' ? 'users' : 'admins', member.id);

    try {
      await setDoc(targetDoc, { ...member, role: nextRole }, { merge: true });
      await deleteDoc(removeDoc).catch(() => undefined);
      setMembers((previous) => previous.map((item) => (item.id === member.id ? { ...item, role: nextRole } : item)));
      toast.success(nextRole === 'admin' ? 'Member promoted to admin' : 'Admin demoted to user');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
    }
  };

  const togglePremiumAccess = async (member: MemberRecord) => {
    const nextPaid = !member.hasPaid;

    try {
      await updateDoc(doc(db, 'users', member.id), {
        hasPaid: nextPaid,
        accessGrantedBy: nextPaid ? 'admin_panel' : null,
      });
      setMembers((previous) => previous.map((item) => (item.id === member.id ? { ...item, hasPaid: nextPaid, accessGrantedBy: nextPaid ? 'admin_panel' : undefined } : item)));
      toast.success(nextPaid ? 'Access enabled' : 'Access revoked');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update access');
    }
  };

  const deleteMember = async (member: MemberRecord) => {
    if (!window.confirm(`Are you sure you want to delete ${member.email || 'this member'}? This cannot be undone.`)) return;

    try {
      const collectionName = member.role === 'admin' ? 'admins' : 'users';
      await deleteDoc(doc(db, collectionName, member.id));
      setMembers((previous) => previous.filter((item) => item.id !== member.id));
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete member');
    }
  };

  const toggleExperienceStatus = async (experience: ExperienceRecord, nextStatus: 'pending' | 'approved') => {
    try {
      await updateDoc(doc(db, 'interviewExperiences', experience.id), {
        status: nextStatus,
        approvedAt: nextStatus === 'approved' ? serverTimestamp() : null,
      });
      setExperiences((previous) => previous.map((item) => (item.id === experience.id ? { ...item, status: nextStatus, approvedAt: nextStatus === 'approved' ? new Date().toISOString() : null } : item)));
      toast.success(nextStatus === 'approved' ? 'Experience approved' : 'Experience moved to pending');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update experience');
    }
  };

  const createNewExperience = () => {
    setEditingExperience({ id: '', name: '', company: '', year: '', rounds: '', hiringProcess: '', description: '', photoUrl: '', status: 'pending' });
  };

  const deleteExperience = async (experienceId: string) => {
    try {
      await deleteDoc(doc(db, 'interviewExperiences', experienceId));
      setExperiences((previous) => previous.filter((item) => item.id !== experienceId));
      toast.success('Experience deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete experience');
    }
  };

  const saveExperience = async () => {
    if (!editingExperience) return;

    try {
      if (!editingExperience.id) {
        // create new
        const docRef = await addDoc(collection(db, 'interviewExperiences'), {
          name: editingExperience.name || '',
          company: editingExperience.company || '',
          year: editingExperience.year || '',
          rounds: editingExperience.rounds || '',
          hiringProcess: editingExperience.hiringProcess || '',
          description: editingExperience.description || '',
          photoUrl: editingExperience.photoUrl || '',
          status: editingExperience.status || 'pending',
          createdAt: serverTimestamp(),
          approvedAt: editingExperience.status === 'approved' ? serverTimestamp() : null,
        });
        setExperiences((previous) => [{ ...editingExperience, id: docRef.id }, ...previous]);
        setEditingExperience(null);
        toast.success('Experience created');
      } else {
        await updateDoc(doc(db, 'interviewExperiences', editingExperience.id), {
          name: editingExperience.name || '',
          company: editingExperience.company || '',
          year: editingExperience.year || '',
          rounds: editingExperience.rounds || '',
          hiringProcess: editingExperience.hiringProcess || '',
          description: editingExperience.description || '',
          photoUrl: editingExperience.photoUrl || '',
          status: editingExperience.status || 'pending',
          approvedAt: editingExperience.status === 'approved' ? serverTimestamp() : null,
        });
        setExperiences((previous) => previous.map((item) => (item.id === editingExperience.id ? { ...item, ...editingExperience, approvedAt: editingExperience.status === 'approved' ? new Date().toISOString() : null } : item)));
        setEditingExperience(null);
        toast.success('Experience updated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save experience');
    }
  };

  const uploadFileForExperience = (file: File | null) => {
    if (!file || !editingExperience) return;
    const path = `experiences/${Date.now()}_${file.name}`;
    const sRef = storageRef(storage, path);
    const uploadTask = uploadBytesResumable(sRef, file);
    setUploadProgress(0);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setUploadProgress(progress);
    }, (err) => {
      console.error('upload err', err);
      toast.error('Upload failed');
      setUploadProgress(null);
    }, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      setEditingExperience({ ...editingExperience, photoUrl: url });
      setUploadProgress(null);
      toast.success('File uploaded');
    });
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-sm">Verifying Access...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;

  const analyticsStats = {
    totalUsers: counts.memberCount,
    activeUsers: members.filter(m => m.hasPaid).length,
    revenue: subscriptions.reduce((sum, s) => sum + (s.amount ?? 0), 0),
    signups: counts.subscriptionCount,
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Admin Portal</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--heading-font)' }}>
            Platform Analytics
          </h1>
        </div>

        {activeTab === 'overview' && <AdminAnalytics stats={analyticsStats} />}

        {/* Horizontal tabs removed to use sidebar navigation */}

        {activeTab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="glass-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Quick Actions</p>
                  <h2 className="mt-2 text-2xl font-black">Admin shortcuts</h2>
                </div>
                {loading && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">Syncing</span>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={() => navigate('#members')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Manage members</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Promote admin, revoke access, review roles.</div>
                </button>
                <button onClick={() => navigate('#coupons')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Manage coupons</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Create and delete promo codes quickly.</div>
                </button>
                <button onClick={() => navigate('#experiences')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Review experiences</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Approve, edit, and publish stories.</div>
                </button>
                <button onClick={() => navigate('#subscriptions')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Billing ledger</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Track paid members and active subscriptions.</div>
                </button>
                <button onClick={() => navigate('#content')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Content studio</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Add topics, modules, formulas, tips, and quizzes.</div>
                </button>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Live Summary</p>
              <h2 className="mt-2 text-2xl font-black">What the portal controls</h2>
              <div className="mt-5 space-y-3 text-sm text-[var(--muted-foreground)]">
                <p>• Promote or demote members between user and admin roles.</p>
                <p>• Grant or revoke premium access without touching the payment flow.</p>
                <p>• Create coupons, disable them, or delete them permanently.</p>
                <p>• Review interview experiences in a polished moderation workflow.</p>
                <p>• See subscriptions and billing history in one dashboard.</p>
                <p>• Create study content, modules, and quizzes for the user panels.</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'members' && (
          <section className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/5">
            <div className="flex flex-col gap-4 border-b border-[var(--border)] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Member Control</p>
                <h2 className="mt-2 text-2xl font-black">Promote, demote, and manage access</h2>
              </div>
              <input
                value={memberQuery}
                onChange={(event) => setMemberQuery(event.target.value)}
                placeholder="Search by name, email, role, or access"
                className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)] sm:max-w-md"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="bg-[var(--muted)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    <th className="border-b border-[var(--border)] p-5">Member</th>
                    <th className="border-b border-[var(--border)] p-5">Role</th>
                    <th className="border-b border-[var(--border)] p-5">Premium</th>
                    <th className="border-b border-[var(--border)] p-5">Access Source</th>
                    <th className="border-b border-[var(--border)] p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredMembers.map((member, index) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="transition-colors hover:bg-[var(--muted)]/50"
                    >
                      <td className="p-5">
                        <div className="font-bold text-[var(--foreground)]">{member.name || 'Unnamed member'}</div>
                        <div className="mt-1 text-sm text-[var(--muted-foreground)]">{member.email || 'No email'}</div>
                        <div className="mt-1 font-mono text-[10px] text-[var(--muted-foreground)]">{member.id}</div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${member.role === 'admin' ? 'border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]' : 'border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                          {member.role || 'user'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${member.hasPaid ? 'border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]' : 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                          {member.hasPaid ? 'Premium access' : 'Free access'}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-[var(--muted-foreground)]">{member.accessGrantedBy || 'manual/admin_panel'}</td>
                      <td className="p-5">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            onClick={() => promoteToAdmin(member)}
                            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)] transition hover:opacity-90"
                          >
                            {member.role === 'admin' ? 'Demote admin' : 'Promote admin'}
                          </button>
                          <button
                            onClick={() => togglePremiumAccess(member)}
                            className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[var(--muted)]"
                          >
                            {member.hasPaid ? 'Revoke access' : 'Grant access'}
                          </button>
                          <button
                            onClick={() => deleteMember(member)}
                            className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-500 transition hover:bg-red-500 hover:text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--muted-foreground)]">
                        No matching members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'coupons' && (
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Coupon Studio</p>
              <h2 className="mt-2 text-2xl font-black">Create coupon</h2>
              <form onSubmit={createCoupon} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Coupon code</label>
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="FRESH29"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 uppercase font-bold tracking-[0.18em] outline-none transition focus:ring-2 focus:ring-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Discount amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={couponDiscount}
                    onChange={(event) => setCouponDiscount(Number(event.target.value))}
                    placeholder="10"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none transition focus:ring-2 focus:ring-[var(--foreground)]"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-[var(--foreground)] px-4 py-3 font-bold text-[var(--background)] transition hover:opacity-90">
                  Create coupon
                </button>
              </form>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Coupon library</p>
                  <h2 className="mt-2 text-2xl font-black">Active and inactive coupons</h2>
                </div>
                <div className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {counts.activeCoupons} live
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-lg font-black tracking-widest">{coupon.code || coupon.id}</div>
                        <div className="mt-1 text-sm text-[var(--primary)]">₹{coupon.discountAmount || 0} OFF</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${coupon.isActive ? 'border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]' : 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <button onClick={() => toggleCoupon(coupon)} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[var(--muted)]">
                          Toggle
                        </button>
                        <button onClick={() => deleteCoupon(coupon.id)} className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-500 transition hover:bg-red-500 hover:text-white">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {coupons.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
                    No coupons created yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
            <section className="glass-card relative overflow-hidden p-6 sm:p-8">
              {/* Background glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-[80px]" />
              
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
                    Live Moderation
                  </div>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)]" style={{ fontFamily: 'var(--heading-font)' }}>
                    Interview Experiences
                  </h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <input
                      value={experienceQuery}
                      onChange={(event) => setExperienceQuery(event.target.value)}
                      placeholder="Search company, name..."
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 px-4 py-2.5 pl-10 text-sm outline-none backdrop-blur-sm transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:w-64"
                    />
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button onClick={createNewExperience} className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm">
                    + Add New
                  </button>
                </div>
              </div>

              <div className="relative mt-6 grid gap-4 lg:grid-cols-2">
                {filteredExperiences.map((experience, index) => (
                  <motion.article
                    key={experience.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]/40 p-5 shadow-sm backdrop-blur-md transition-all hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-bold text-[var(--foreground)]">{experience.company || 'Unknown Company'}</h3>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            experience.status === 'approved' 
                              ? 'border-green-500/30 bg-green-500/10 text-green-500' 
                              : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {experience.status || 'pending'}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-semibold text-[var(--muted-foreground)]">
                          By {experience.name || 'Anonymous'} • {experience.year || 'N/A'}
                        </p>
                      </div>
                      {experience.photoUrl ? (
                        <img src={experience.photoUrl} alt="Company" className="h-10 w-10 shrink-0 rounded-lg border border-[var(--border)] object-cover shadow-sm" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-xs font-bold text-[var(--muted-foreground)]">
                          {experience.company ? experience.company.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]/80">
                      {experience.description || 'No description provided.'}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                      <div className="flex gap-2">
                         <button onClick={() => setEditingExperience(experience)} className="btn-outline rounded-xl px-3 py-1.5 text-xs font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)]">
                           Edit
                         </button>
                         <button onClick={() => deleteExperience(experience.id)} className="btn-outline rounded-xl border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white">
                           Delete
                         </button>
                      </div>
                      
                      <button 
                        onClick={() => toggleExperienceStatus(experience, experience.status === 'approved' ? 'pending' : 'approved')} 
                        className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                          experience.status === 'approved' 
                            ? 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                            : 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 hover:scale-105'
                        }`}
                      >
                        {experience.status === 'approved' ? 'Revoke' : 'Approve'}
                      </button>
                    </div>
                  </motion.article>
                ))}

                {filteredExperiences.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--muted)]/20 p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background)] shadow-sm">
                      <svg className="h-8 w-8 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="mt-4 font-bold text-[var(--foreground)]">No experiences found</h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">Try adjusting your search filters or add a new one.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="glass-card flex flex-col gap-4 p-6 sm:p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--heading-font)' }}>Moderation Guidelines</h2>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                <p><strong>1. Verify Details:</strong> Ensure company names and years are accurate before approving.</p>
                <p><strong>2. Formatting:</strong> Clean up typos or formatting issues by clicking "Edit".</p>
                <p><strong>3. Images:</strong> If the student provided a relevant image, make sure it renders correctly.</p>
                <p><strong>4. Spam:</strong> Instantly delete any spam or duplicate entries to keep the platform clean.</p>
              </div>
              
              <div className="mt-auto border-t border-[var(--border)] pt-6">
                 <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--muted-foreground)]">Pending Review</span>
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 font-black text-yellow-500">{counts.pendingExperiences}</span>
                 </div>
                 <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--muted-foreground)]">Approved</span>
                    <span className="rounded-full bg-green-500/10 px-3 py-1 font-black text-green-500">{counts.approvedExperiences}</span>
                 </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <section className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/5">
            <div className="border-b border-[var(--border)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Billing Ledger</p>
              <h2 className="mt-2 text-2xl font-black">Subscriptions and paid access</h2>
            </div>
            <div className="grid gap-3 p-6">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-bold">{subscription.email || subscription.userEmail || subscription.uid || subscription.id}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{subscription.status || 'active'}</div>
                  </div>
                  {subscription.amount !== undefined && <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">₹{subscription.amount}</div>}
                </div>
              ))}
              {subscriptions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
                  No subscriptions found.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'content' && <AdminContentStudio />}
      </div>

      {editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setEditingExperience(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-3xl rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Edit experience</p>
                <h3 className="mt-2 text-2xl font-black">Refine story details</h3>
              </div>
              <button onClick={() => setEditingExperience(null)} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-bold transition hover:bg-[var(--muted)]">
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <input value={editingExperience.name || ''} onChange={(event) => setEditingExperience({ ...editingExperience, name: event.target.value })} placeholder="Name" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <input value={editingExperience.company || ''} onChange={(event) => setEditingExperience({ ...editingExperience, company: event.target.value })} placeholder="Company" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <input value={editingExperience.year || ''} onChange={(event) => setEditingExperience({ ...editingExperience, year: event.target.value })} placeholder="Year" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <input value={editingExperience.photoUrl || ''} onChange={(event) => setEditingExperience({ ...editingExperience, photoUrl: event.target.value })} placeholder="Photo / PDF URL" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <div className="text-sm text-[var(--muted-foreground)]">Or upload a file (image or PDF) — it will be stored in Firebase Storage and attached to this experience.</div>
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => uploadFileForExperience(e.target.files ? e.target.files[0] : null)} />
                  {uploadProgress !== null && <div className="text-xs font-bold">Uploading: {uploadProgress}%</div>}
                </div>
                <input value={editingExperience.rounds || ''} onChange={(event) => setEditingExperience({ ...editingExperience, rounds: event.target.value })} placeholder="Rounds / format" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
              </div>

              <div className="space-y-4">
                <input value={editingExperience.hiringProcess || ''} onChange={(event) => setEditingExperience({ ...editingExperience, hiringProcess: event.target.value })} placeholder="Hiring process" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <textarea value={editingExperience.description || ''} onChange={(event) => setEditingExperience({ ...editingExperience, description: event.target.value })} placeholder="Description" rows={8} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
                <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold">
                  <input type="checkbox" checked={editingExperience.status === 'approved'} onChange={(event) => setEditingExperience({ ...editingExperience, status: event.target.checked ? 'approved' : 'pending' })} />
                  Approved
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button onClick={() => setEditingExperience(null)} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold transition hover:bg-[var(--muted)]">
                Cancel
              </button>
              <button onClick={saveExperience} className="rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-bold text-[var(--background)] transition hover:opacity-90">
                Save changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Admin;
