import { useEffect, useState } from "react";
import problems from '../data/problems';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const Practice = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem('subscribed') || 'false'); } catch { return false; }
  });
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    localStorage.setItem('subscribed', JSON.stringify(subscribed));
  }, [subscribed]);

  useEffect(() => {
    const completed: Record<number, boolean> = {};
    problems.forEach((problem: any) => {
      completed[problem.id] = localStorage.getItem(`progress_v1_${problem.id}`) === 'true';
    });
    setCompletedMap(completed);
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    // Server-side order creation -> client checkout -> server-side verification
    try {
      const createRes = await fetch('/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 29 * 100, currency: 'INR', uid: user.uid, email: user.email })
      });

      if (!createRes.ok) throw new Error('Failed to create order');
      const order = await createRes.json();

      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'FreshHire Pro',
        description: 'Subscription — ₹29',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment server-side
            const verifyRes = await fetch('/verifyPayment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                uid: user.uid,
                email: user.email,
                amount: order.amount
              })
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed');
            const payload = await verifyRes.json();
            if (payload.success) {
              setSubscribed(true);
              toast.success('Subscription successful — access granted');
            } else {
              toast.error('Payment verified but recording failed. Contact admin.');
            }
          } catch (err) {
            console.error(err);
            toast.error('Verification error. Contact admin.');
          }
        }
      };

      // load Razorpay script and open checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      toast.error('Unable to start subscription. Try again later.');
    }
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank');
  };

  const toggleProgress = (id: number) => {
    const key = `progress_v1_${id}`;
    const current = localStorage.getItem(key) === 'true';
    localStorage.setItem(key, JSON.stringify(!current));
    setCompletedMap((prev) => ({ ...prev, [id]: !current }));
    toast.success(!current ? 'Marked done (local browser storage)' : 'Marked undone');
  };

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProblems = normalizedQuery
    ? problems.filter((problem: any) => {
        const haystack = `${problem.title} ${problem.category} ${problem.difficulty}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : problems;

  const groupedProblems = filteredProblems.reduce((acc: Record<string, typeof problems>, problem: any) => {
    if (!acc[problem.category]) acc[problem.category] = [] as any;
    acc[problem.category].push(problem);
    return acc;
  }, {});
  const categoryOrder = Object.keys(groupedProblems);
  const visibleCount = filteredProblems.length;
  const completionRate = problems.length ? Math.round((completedCount / problems.length) * 100) : 0;
  const accentPalette = [
    'from-orange-500 via-amber-400 to-rose-400',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-fuchsia-500 via-pink-500 to-rose-500',
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-16 overflow-hidden">
      <div aria-hidden="true" className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute top-32 -right-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

      <div className="relative mb-8 overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--card)]/90 p-7 shadow-2xl shadow-black/10 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_34%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              Top Interview 150
            </div>
            <div>
              <h1 className="max-w-3xl text-4xl md:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[0.95]">
                One focused DSA track.
                <span className="block bg-gradient-to-r from-[var(--primary)] via-orange-500 to-amber-400 bg-clip-text text-transparent">
                  Less noise. More reps.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-[var(--muted-foreground)] font-medium text-base md:text-lg leading-relaxed">
                One study path, one subscription, and every question opens to the exact problem page. Progress stays in your browser, so the page feels like a living notebook instead of a static table.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-bold text-[var(--muted-foreground)]">
              <span className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]">₹29 unlock</span>
              <span className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]">Local progress</span>
              <span className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]">Direct question links</span>
              <span className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]">Sticky topic rail</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/90 p-5 shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Progress</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-4xl font-black text-[var(--foreground)]">{completionRate}%</div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Completed locally</p>
                </div>
                <div className="h-20 w-20 rounded-full border-[10px] border-[var(--muted)] bg-[var(--card)] flex items-center justify-center text-sm font-black text-[var(--foreground)]">
                  {completedCount}
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/90 p-5 shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Search results</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-4xl font-black text-[var(--foreground)]">{visibleCount}</div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Questions visible now</p>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-orange-400 shadow-lg shadow-orange-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!subscribed && (
        <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-[var(--card)] to-cyan-500/10 p-5 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-500">Unlock the track</p>
              <p className="mt-2 text-[var(--foreground)] font-semibold max-w-2xl">Access to the full practice list is behind a one-time subscription of ₹29.</p>
            </div>
            <button onClick={handleSubscribe} className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-0.5">
              Subscribe ₹29
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24 h-fit rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/95 p-5 shadow-xl backdrop-blur">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Search topics</p>
            <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 transition-shadow focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:shadow-lg focus-within:shadow-orange-500/10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, category, difficulty"
                className="w-full bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] font-medium"
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Showing {filteredProblems.length} of {problems.length} questions.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--foreground)]">
              <span>Progress</span>
              <span>{completedCount}/{problems.length}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] via-orange-500 to-amber-400"
                style={{ width: `${problems.length ? (completedCount / problems.length) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">Saved locally in this browser.</p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Topics</h2>
              <span className="text-xs font-bold text-[var(--muted-foreground)]">{categoryOrder.length}</span>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {categoryOrder.map((category, index) => {
                const sectionId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const count = groupedProblems[category].length;
                return (
                  <a
                    key={category}
                    href={`#${sectionId}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-lg hover:shadow-orange-500/10"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br ${accentPalette[index % accentPalette.length]}`} />
                      <span className="line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{category}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">{count}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-8 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">Completed: {completedCount}/{problems.length}</span>
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">Saved in this browser only</span>
            <span className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">Open items unlock with the demo account</span>
            {normalizedQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>

          {categoryOrder.length === 0 ? (
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-2xl font-black text-[var(--foreground)]">No matching questions</h3>
              <p className="mt-3 text-[var(--muted-foreground)]">Try a broader keyword, category, or difficulty label.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProblems).map(([category, categoryProblems]) => {
                const completedInCategory = categoryProblems.filter((problem: any) => completedMap[problem.id]).length;
                const sectionId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const categoryIndex = categoryOrder.indexOf(category);
                const accentClass = accentPalette[categoryIndex % accentPalette.length];

                return (
                  <section key={category} id={sectionId} className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-xl">
                    <div className={`h-2 bg-gradient-to-r ${accentClass}`} />
                    <div className="flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--background)]/75 px-6 py-5 md:flex-row md:items-end md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${accentClass}`} />
                          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Section {completedInCategory}/{categoryProblems.length} done</p>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--foreground)]">{category}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                        <span className="px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">{categoryProblems.length} questions</span>
                        <span className="px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">{completedInCategory} completed</span>
                      </div>
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                      {categoryProblems.map((p: any) => {
                        const completed = completedMap[p.id];
                        return (
                          <div key={p.id} className={`group relative overflow-hidden p-5 md:p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all ${completed ? 'bg-[var(--primary)]/5' : 'bg-[var(--background)] hover:bg-[var(--muted)]/30'}`}>
                            <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accentClass} ${completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'} transition-opacity`} />
                            <div className="space-y-2">
                              <div className={`font-black text-lg text-[var(--foreground)] ${completed ? 'line-through opacity-70' : ''}`}>{p.id}. {p.title}</div>
                              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                                <span className="px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">{p.difficulty}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <button onClick={() => toggleProgress(p.id)} className={`text-sm px-4 py-2 rounded-full border font-bold transition-all ${completed ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-orange-500/15' : 'bg-[var(--muted)] border-[var(--border)] hover:border-[var(--primary)]'}`}>{completed ? 'Done' : 'Mark done'}</button>
                              <button
                                onClick={() => subscribed ? handleOpen(p.url) : toast.error('Subscribe to access')}
                                className={`px-4 py-2 rounded-full font-black transition-all ${subscribed ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg shadow-black/10 hover:-translate-y-0.5' : 'bg-[var(--muted)] text-[var(--foreground)] hover:border-[var(--primary)]'}`}
                              >
                                Open exact question
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
