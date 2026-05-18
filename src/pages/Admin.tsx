import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { storage } from '../config/firebase';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { db, hasValidFirebaseConfig } from '../config/firebase';

type TabId = 'overview' | 'members' | 'coupons' | 'experiences' | 'subscriptions';

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

const tabItems: { id: TabId; label: string; description: string }[] = [
  { id: 'overview', label: 'Overview', description: 'Live counts and admin actions' },
  { id: 'members', label: 'Members', description: 'Promote, demote, and grant access' },
  { id: 'coupons', label: 'Coupons', description: 'Create, toggle, and delete coupons' },
  { id: 'experiences', label: 'Experiences', description: 'Review and publish interview stories' },
  { id: 'subscriptions', label: 'Subscriptions', description: 'Billing and access ledger' },
];

export const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
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
      const [usersSnap, adminsSnap, couponsSnap, experiencesSnap, subscriptionsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'admins')),
        getDocs(collection(db, 'coupons')),
        getDocs(collection(db, 'interviewExperiences')),
        getDocs(collection(db, 'subscriptions')),
      ]);

      const userMembers = usersSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object), role: 'user' as const }));
      const adminMembers = adminsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object), role: 'admin' as const }));

      setMembers([...adminMembers, ...userMembers]);
      setCoupons(couponsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
      setExperiences(experiencesSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
      setSubscriptions(subscriptionsSnap.docs.map((item) => ({ id: item.id, ...(item.data() as object) })));
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
    };
  }, [coupons, experiences, members, subscriptions]);

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
        setExperiences((previous) => [{ id: docRef.id, ...editingExperience }, ...previous]);
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

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(180deg,_rgba(12,15,24,0.4),_transparent_20%),var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Admin Portal
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Control access, coupons, and interview moderation from one place.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                This panel is built for admin work only. Manage membership access, promote admins, remove coupons, and publish the best interview experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Members', value: counts.memberCount },
                { label: 'Admins', value: counts.adminCount },
                { label: 'Coupons', value: counts.couponCount },
                { label: 'Live Coupons', value: counts.activeCoupons },
                { label: 'Pending Stories', value: counts.pendingExperiences },
                { label: 'Subscriptions', value: counts.subscriptionCount },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 text-center shadow-lg shadow-black/5 backdrop-blur">
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl shadow-black/5 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-5">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${activeTab === tab.id
                  ? 'border-transparent bg-[var(--foreground)] text-[var(--background)] shadow-lg shadow-black/20'
                  : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:-translate-y-0.5 hover:bg-[var(--muted)]'
                  }`}
              >
                <div className="text-sm font-black uppercase tracking-[0.18em]">{tab.label}</div>
                <div className={`mt-1 text-xs ${activeTab === tab.id ? 'text-[var(--background)]/75' : 'text-[var(--muted-foreground)]'}`}>
                  {tab.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Quick Actions</p>
                  <h2 className="mt-2 text-2xl font-black">Admin shortcuts</h2>
                </div>
                {loading && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">Syncing</span>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={() => setActiveTab('members')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Manage members</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Promote admin, revoke access, review roles.</div>
                </button>
                <button onClick={() => setActiveTab('coupons')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Manage coupons</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Create and delete promo codes quickly.</div>
                </button>
                <button onClick={() => setActiveTab('experiences')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Review experiences</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Approve, edit, and publish stories.</div>
                </button>
                <button onClick={() => setActiveTab('subscriptions')} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="font-black">Billing ledger</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">Track paid members and active subscriptions.</div>
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
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${member.role === 'admin' ? 'border-purple-500/20 bg-purple-500/10 text-purple-500' : 'border-blue-500/20 bg-blue-500/10 text-blue-500'}`}>
                          {member.role || 'user'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${member.hasPaid ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
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
                        <div className="mt-1 text-sm text-emerald-500">₹{coupon.discountAmount || 0} OFF</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${coupon.isActive ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
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
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Experience Moderation</p>
                  <h2 className="mt-2 text-2xl font-black">Approve, edit, and publish stories</h2>
                </div>
                <input
                  value={experienceQuery}
                  onChange={(event) => setExperienceQuery(event.target.value)}
                  placeholder="Search by company, name, rounds, or status"
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--foreground)] sm:max-w-md"
                />
                  <div className="mt-3 sm:mt-0">
                    <button onClick={createNewExperience} className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-bold text-[var(--background)]">Add experience</button>
                  </div>
              </div>

              <div className="mt-5 grid gap-4">
                {filteredExperiences.map((experience, index) => (
                  <motion.article
                    key={experience.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="grid gap-4 p-5 lg:grid-cols-[1fr_180px]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-black">{experience.name || 'Anonymous'}</h3>
                          <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${experience.status === 'approved' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/20 bg-amber-500/10 text-amber-500'}`}>
                            {experience.status || 'pending'}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                          {experience.company || 'Unknown company'} • {experience.year || 'N/A'}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          {experience.rounds && <span className="rounded-full border border-[var(--border)] px-3 py-1">{experience.rounds}</span>}
                          {experience.hiringProcess && <span className="rounded-full border border-[var(--border)] px-3 py-1">{experience.hiringProcess}</span>}
                        </div>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--foreground)]/85">{experience.description || 'No description provided.'}</p>
                      </div>

                      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]">
                          {experience.photoUrl ? (
                            <img src={experience.photoUrl} alt={experience.name || 'experience'} className="h-32 w-full object-cover" />
                          ) : (
                            <div className="flex h-32 items-center justify-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                              No image
                            </div>
                          )}
                        </div>

                        <button onClick={() => setEditingExperience(experience)} className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--background)] transition hover:opacity-90">
                          Edit
                        </button>
                        <button onClick={() => toggleExperienceStatus(experience, experience.status === 'approved' ? 'pending' : 'approved')} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[var(--muted)]">
                          {experience.status === 'approved' ? 'Move to pending' : 'Approve'}
                        </button>
                        <button onClick={() => deleteExperience(experience.id)} className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-500 transition hover:bg-red-500 hover:text-white">
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}

                {filteredExperiences.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
                    No matching experiences found.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Stories focus</p>
              <h2 className="mt-2 text-2xl font-black">Admin story workflow</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
                <p>Use the search box to find a company, role, or key phrase.</p>
                <p>Approve a story to publish it immediately, or return it to pending.</p>
                <p>Edit the text and metadata before it goes live.</p>
                <p>Delete stories that are spam, duplicated, or low quality.</p>
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
                  {subscription.amount !== undefined && <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-500">₹{subscription.amount}</div>}
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
  );
};

export default Admin;
