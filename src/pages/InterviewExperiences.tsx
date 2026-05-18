import { useEffect, useMemo, useState } from 'react';

import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import PdfViewer from '../components/PdfViewer';

type Experience = {
  id: string;
  name?: string;
  regNumber?: string | null;
  year?: string | null;
  company?: string | null;
  hiringProcess?: string | null;
  rounds?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  status?: string;
  createdAt?: any;
  approvedAt?: any;
};

type CompanyGroup = {
  key: string;
  company: string;
  experiences: Experience[];
  latestExperience: Experience;
  latestTime: number;
};

const getTimestampValue = (value: any) => {
  if (!value) return 0;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value).getTime() || 0;
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  return 0;
};

const getExperienceTime = (experience: Experience) => getTimestampValue(experience.approvedAt || experience.createdAt);

const normalizeCompany = (company?: string | null) => (company || '').trim().toLowerCase();

// featuredStories removed per user request — use Firestore content instead

export const InterviewExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyGroup | null>(null);
  const [activeExperienceId, setActiveExperienceId] = useState('');

  // Form state - tabbed
  const [formTab, setFormTab] = useState<'basic' | 'details' | 'media'>('basic');
  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [year, setYear] = useState('');
  const [company, setCompany] = useState('');
  const [hiringProcess, setHiringProcess] = useState('');
  const [rounds, setRounds] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isPdfUrl = (url?: string | null) => !!url && /\.pdf(?:$|\?)/i.test(url);

  const getInitials = (nameValue?: string | null) => {
    if (!nameValue) return 'NA';
    const initials = nameValue
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
    return initials || 'NA';
  };

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const q = query(collection(db, 'interviewExperiences'), where('status', '==', 'approved'));
        const snap = await getDocs(q);
        const approved = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Experience))
          .sort((a, b) => getExperienceTime(b) - getExperienceTime(a));
        setExperiences(approved);
      } catch (err) {
        console.error('fetch experiences', err);
      }
    };

    fetchApproved();
  }, []);

  const companyGroups = useMemo<CompanyGroup[]>(() => {
    const groups = new Map<string, Experience[]>();

    experiences.forEach((experience) => {
      const companyKey = normalizeCompany(experience.company);
      if (!companyKey) return;

      const existing = groups.get(companyKey) || [];
      groups.set(companyKey, [...existing, experience]);
    });

    return Array.from(groups.entries())
      .map(([key, list]) => {
        const sortedList = [...list].sort((a, b) => getExperienceTime(b) - getExperienceTime(a));
        return {
          key,
          company: sortedList[0]?.company || 'Unknown company',
          experiences: sortedList,
          latestExperience: sortedList[0],
          latestTime: getExperienceTime(sortedList[0])
        };
      })
      .sort((a, b) => b.latestTime - a.latestTime);
  }, [experiences]);

  const filteredCompanyGroups = useMemo(() => {
    const term = companySearch.trim().toLowerCase();
    if (!term) return companyGroups;

    return companyGroups.filter((group) => {
      const searchableText = [group.company, group.latestExperience?.name, group.latestExperience?.description, group.latestExperience?.hiringProcess, group.latestExperience?.rounds]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(term);
    });
  }, [companyGroups, companySearch]);

  const activeExperience = useMemo(() => {
    if (!selectedCompany) return null;
    return selectedCompany.experiences.find((experience) => experience.id === activeExperienceId) || selectedCompany.latestExperience;
  }, [selectedCompany, activeExperienceId]);

  const openCompany = (group: CompanyGroup) => {
    setSelectedCompany(group);
    setActiveExperienceId(group.latestExperience?.id || '');
  };

  const renderDescription = (text?: string | null) => {
    if (!text) return null;
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para, idx) => (
      <p key={idx} className="mb-3 text-sm leading-relaxed text-[var(--foreground)]">
        {para.split(/\n/).map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  // Prevent background scroll while modal is open and restore scroll position on close
  useEffect(() => {
    if (selectedCompany) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.setAttribute('data-scroll-y', String(scrollY));
    } else {
      const stored = document.body.getAttribute('data-scroll-y');
      if (stored) {
        const scrollY = parseInt(stored, 10) || 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.removeAttribute('data-scroll-y');
        window.scrollTo(0, scrollY);
      }
    }
    // cleanup in case component unmounts while modal open
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.removeAttribute('data-scroll-y');
    };
  }, [selectedCompany]);

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !description) {
      toast.error('Please provide name, company and experience description');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'interviewExperiences'), {
        name,
        regNumber: regNumber || null,
        year: year || null,
        company,
        hiringProcess: hiringProcess || null,
        rounds: rounds || null,
        description,
        photoUrl: photoUrl || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setName('');
      setRegNumber('');
      setYear('');
      setCompany('');
      setHiringProcess('');
      setRounds('');
      setDescription('');
      setPhotoUrl('');
      setFormTab('basic');
      setShowComposer(false);
      toast.success('Thanks — your experience was submitted for review.');
    } catch (err) {
      console.error('submit exp', err);
      toast.error('Failed to submit. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[var(--background)] px-4 py-8 sm:px-8">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--primary)]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-56 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1200px] relative z-10">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/85 p-6 shadow-xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Logo />
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                  Interview stories
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Browse company experiences in a clean, focused layout.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  Open a company card to read the full story, view attached PDFs or images, and switch between multiple experiences without leaving the page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowComposer((value) => !value)}
              className="self-start rounded-full bg-gradient-to-r from-[var(--primary)] to-teal-400 px-5 py-3 text-sm font-black text-white shadow-lg shadow-[var(--primary)]/20 transition hover:scale-[1.01]"
            >
              {showComposer ? 'View published experiences' : 'Publish your experience'}
            </button>
          </div>
        </section>

        {!showComposer ? (
          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl sm:p-6">
              {/* Featured stories removed — showing published companies only */}

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black">Published Companies</h3>
                <p className="text-sm text-[var(--muted-foreground)]">One tab per company. Open a company to see all of its experiences.</p>
              </div>
              <div className="w-full sm:w-[320px]">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Search company</label>
                <input
                  value={companySearch}
                  onChange={(event) => setCompanySearch(event.target.value)}
                  placeholder="Type a company name"
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {filteredCompanyGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-[var(--muted-foreground)]">
                No matching company found.
              </div>
            ) : (
              <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2 snap-x snap-mandatory">
                {filteredCompanyGroups.map((group) => {
                  const latest = group.latestExperience;
                  const heroImage = latest?.photoUrl && !isPdfUrl(latest.photoUrl) ? latest.photoUrl : '';

                  return (
                    <article
                      key={group.key}
                      onClick={() => openCompany(group)}
                      className="group min-w-[320px] max-w-[320px] snap-start cursor-pointer overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[var(--foreground)] to-[var(--muted)]">
                        {heroImage ? (
                          <img src={heroImage} alt={`${group.company} company`} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl font-black text-[var(--background)]/80">
                            {getInitials(group.company)}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="truncate text-lg font-black">{group.company}</h4>
                              <p className="text-xs font-semibold text-white/80">{group.experiences.length} experience{group.experiences.length > 1 ? 's' : ''}</p>
                            </div>
                            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur">
                              Open
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--muted-foreground)]">
                          <span>{latest?.year ? `${latest.year}` : ''}</span>
                        </div>

                        <p className="line-clamp-4 text-sm leading-6 text-[var(--foreground)]">{latest?.description}</p>

                        <div className="mt-4 text-xs font-semibold text-[var(--muted-foreground)]">
                          {latest?.hiringProcess || ''}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">Share Your Experience</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Submit details about your interview. Admins review before publishing.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold"
              >
                Back
              </button>
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setFormTab('basic')} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${formTab === 'basic' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border border-[var(--border)] text-[var(--muted-foreground)]'}`}>Basic</button>
              <button onClick={() => setFormTab('details')} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${formTab === 'details' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border border-[var(--border)] text-[var(--muted-foreground)]'}`}>Details</button>
              <button onClick={() => setFormTab('media')} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${formTab === 'media' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border border-[var(--border)] text-[var(--muted-foreground)]'}`}>Media</button>
            </div>

            <form onSubmit={handleSubmitExperience} className="space-y-4">
              {formTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Full name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Reg / ID (optional)</label>
                      <input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Year (optional)</label>
                      <input value={year} onChange={(e) => setYear(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Company name</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                </div>
              )}

              {formTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Hiring process (short)</label>
                    <input value={hiringProcess} onChange={(e) => setHiringProcess(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Rounds / format</label>
                    <input value={rounds} onChange={(e) => setRounds(e.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Experience (what happened)</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                </div>
              )}

              {formTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Photo / PDF / media URL (optional)</label>
                    <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Image link or PDF link" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4" />
                  </div>
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)]">
                    Optional: upload a file somewhere and paste the public URL here. If several experiences exist for one company, they will stay under one company tab.
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button disabled={submitting} type="submit" className="rounded-full bg-[var(--foreground)] px-6 py-3 font-black text-[var(--background)]">
                  {submitting ? 'Submitting...' : 'Submit for review'}
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--muted-foreground)]"
                  onClick={() => {
                    setName('');
                    setRegNumber('');
                    setYear('');
                    setCompany('');
                    setHiringProcess('');
                    setRounds('');
                    setDescription('');
                    setPhotoUrl('');
                    setFormTab('basic');
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      <Footer />

      {selectedCompany && activeExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)]/75 p-5 sm:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Company tab</p>
                <h3 className="mt-2 text-2xl font-black">{selectedCompany.company}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{selectedCompany.experiences.length} experiences • latest first</p>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold">
                Close
              </button>
            </div>

            <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr] flex-1 overflow-auto">
              <div className="border-b border-[var(--border)] p-4 md:border-b-0 md:border-r md:p-6">
                {activeExperience.photoUrl ? (
                  isPdfUrl(activeExperience.photoUrl) ? (
                    <PdfViewer url={activeExperience.photoUrl} title={`${selectedCompany.company} media`} />
                  ) : (
                    <img src={activeExperience.photoUrl} alt={`${selectedCompany.company} company media`} className="h-[520px] w-full rounded-[1.5rem] object-cover shadow-xl" />
                  )
                ) : (
                  <div className="flex h-[520px] items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--background)] text-center text-sm text-[var(--muted-foreground)]">
                    No company media attached for this story.
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">{activeExperience.name || 'Experience'}</span>
                  {activeExperience.year && <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">{activeExperience.year}</span>}
                  {activeExperience.hiringProcess && <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-bold text-[var(--muted-foreground)]">{activeExperience.hiringProcess}</span>}
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-5 text-sm leading-relaxed text-[var(--foreground)] shadow-sm max-h-[520px] overflow-y-auto">
                  {renderDescription(activeExperience.description)}
                </div>

                {selectedCompany.experiences.length > 1 && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[var(--muted-foreground)]">More from this company</p>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {selectedCompany.experiences.map((experience) => (
                        <button
                          key={experience.id}
                          type="button"
                          onClick={() => setActiveExperienceId(experience.id)}
                          className={`min-w-[180px] rounded-2xl border px-4 py-3 text-left transition ${activeExperience.id === experience.id ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]' : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]'}`}
                        >
                          <div className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">{experience.year || 'Latest'}</div>
                          <div className="mt-1 line-clamp-2 text-sm font-bold">{experience.name}</div>
                          <div className="mt-1 text-xs opacity-70">{getMediaLabel(experience)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
            <div className="border-t border-[var(--border)] bg-[var(--background)] p-4 flex justify-end">
              <button className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-black text-[var(--background)]" onClick={() => setSelectedCompany(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewExperiences;
