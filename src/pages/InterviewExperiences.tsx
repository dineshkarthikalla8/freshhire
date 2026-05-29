import { useEffect, useMemo, useState } from 'react';

import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiBookOpen, FiUsers, FiCalendar } from 'react-icons/fi';
import { GlassCard } from '../components/ui/GlassCard';
import Footer from '../components/Footer';
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

const experienceCountLabel = (n: number) =>
  `${n} interview experience${n === 1 ? '' : 's'}`;

export const InterviewExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [pageTab, setPageTab] = useState<'read' | 'post'>('read');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyGroup | null>(null);
  const [activeExperienceId, setActiveExperienceId] = useState('');

  // Form state - tabbed
  const [formTab, setFormTab] = useState<'basic' | 'details' | 'media'>('basic');
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
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
        contactEmail: contactEmail || null,
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
      setContactEmail('');
      setRegNumber('');
      setYear('');
      setCompany('');
      setHiringProcess('');
      setRounds('');
      setDescription('');
      setPhotoUrl('');
      setFormTab('basic');
      setPageTab('read');
      toast.success('Interview experience submitted! We will review and publish it soon.');
    } catch (err) {
      console.error('submit exp', err);
      toast.error('Failed to submit. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-[1200px] text-center">
        <p className="section-eyebrow">Interview Experience</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ fontFamily: 'var(--heading-font)' }}>
          Placement interview experiences by company
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">
          Search any company, read verified interview experiences, or post your own — no login required.
        </p>
        <div className="mx-auto mt-6 inline-flex w-full max-w-md flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 sm:inline-flex sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => setPageTab('read')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${pageTab === 'read' ? 'bg-[var(--primary)] text-white shadow-[var(--glow-red)]' : 'text-[var(--muted-foreground)]'}`}
          >
            <FiBookOpen className="h-4 w-4" />
            Browse experiences
          </button>
          <button
            type="button"
            onClick={() => setPageTab('post')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${pageTab === 'post' ? 'bg-[var(--primary)] text-white shadow-[var(--glow-red)]' : 'text-[var(--muted-foreground)]'}`}
          >
            <FiPlus className="h-4 w-4" />
            Post experience
          </button>
        </div>
        <p className="mt-4 text-xs font-medium text-[var(--muted-foreground)]">
          {companyGroups.length} companies · {experiences.length} published interview experiences
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-[1200px]">
      {pageTab === 'read' ? (
        <GlassCard className="!p-4 sm:!p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Companies</h2>
              <p className="text-sm text-[var(--muted-foreground)]">Select a company to view all interview experiences.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                value={companySearch}
                onChange={(event) => setCompanySearch(event.target.value)}
                placeholder="Search company (e.g. Google, Amazon, TCS)..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {filteredCompanyGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--muted-foreground)]">
              <FiUsers className="mx-auto mb-2 h-8 w-8 opacity-50" />
              No companies match your search. Post the first interview experience for this company.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompanyGroups.map((group, index) => {
                  const latest = group.latestExperience;
                  const heroImage = latest?.photoUrl && !isPdfUrl(latest.photoUrl) ? latest.photoUrl : '';

                  return (
                    <motion.article
                      key={group.key}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -4 }}
                      onClick={() => openCompany(group)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10"
                    >
                      <div className="flex items-start justify-between p-5 border-b border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          {heroImage ? (
                            <img src={heroImage} alt={`${group.company} company`} className="h-12 w-12 rounded-xl object-cover border border-[var(--border)]" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-orange-500/20 text-lg font-black text-[var(--primary)]">
                              {getInitials(group.company)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>{group.company}</h4>
                            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{experienceCountLabel(group.experiences.length)}</p>
                          </div>
                        </div>
                        <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] transition-transform group-hover:translate-x-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-sm text-[var(--foreground)]">{latest?.name || 'Candidate'}</span>
                          <span className="text-xs text-[var(--muted-foreground)]">•</span>
                          {latest?.year && <span className="text-xs font-medium text-[var(--muted-foreground)]">Batch {latest.year}</span>}
                        </div>
                        
                        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]/80 transition-colors">
                          {latest?.description || 'Click to read full interview experience...'}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                           {latest?.rounds && (
                            <span className="inline-flex items-center rounded-md bg-[var(--background)] border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                              {latest.rounds}
                            </span>
                          )}
                          {latest?.hiringProcess && (
                            <span className="inline-flex items-center rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
                              {latest.hiringProcess}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
            </div>
          )}
        </GlassCard>
      ) : (
          <GlassCard className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Post Interview Experience</h2>
                <p className="text-sm text-[var(--muted-foreground)]">No login required. Share round details honestly — we review before publishing.</p>
              </div>
              <button
                type="button"
                onClick={() => setPageTab('read')}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold"
              >
                Back to read
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {(['basic', 'details', 'media'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFormTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                    formTab === tab ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitExperience} className="space-y-4">
              {formTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Full name *</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-2" required placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Email (optional)</label>
                    <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input-field mt-2" placeholder="you@college.edu" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Reg / ID (optional)</label>
                      <input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="input-field mt-2" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Year (optional)</label>
                      <input value={year} onChange={(e) => setYear(e.target.value)} className="input-field mt-2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Company name</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} className="input-field mt-2" />
                  </div>
                </div>
              )}

              {formTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Hiring process (short)</label>
                    <input value={hiringProcess} onChange={(e) => setHiringProcess(e.target.value)} className="input-field mt-2" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Rounds / format</label>
                    <input value={rounds} onChange={(e) => setRounds(e.target.value)} className="input-field mt-2" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Interview experience details *</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="input-field mt-2 min-h-[160px] resize-y" />
                  </div>
                </div>
              )}

              {formTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Photo / PDF / media URL (optional)</label>
                    <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Image link or PDF link" className="input-field mt-2" />
                  </div>
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)]">
                    Optional: upload a file somewhere and paste the public URL here. If several experiences exist for one company, they will stay under one company tab.
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button disabled={submitting} type="submit" className="btn-primary px-6 py-3 text-sm disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit for review'}
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--muted-foreground)]"
                  onClick={() => {
                    setName('');
                    setContactEmail('');
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
          </GlassCard>
        )}
      </div>

      {selectedCompany && activeExperience && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-orange-500/20 text-sm font-black text-[var(--primary)]">
                  {getInitials(selectedCompany.company)}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
                    {selectedCompany.company}
                  </h2>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    {experienceCountLabel(selectedCompany.experiences.length)} available
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedCompany(null)} className="rounded-full bg-[var(--muted)] p-2 text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar: List of Experiences */}
              {selectedCompany.experiences.length > 1 && (
                <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto hidden md:block">
                  <div className="sticky top-0 bg-[var(--surface)]/90 backdrop-blur px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Stories</p>
                  </div>
                  <ul className="p-2 space-y-1">
                    {selectedCompany.experiences.map((experience, idx) => (
                      <li key={experience.id}>
                        <button
                          type="button"
                          onClick={() => setActiveExperienceId(experience.id)}
                          className={`w-full rounded-xl px-4 py-3 text-left transition-colors ${
                            activeExperience.id === experience.id
                              ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-bold'
                              : 'text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
                          }`}
                        >
                          <p className="text-sm truncate">{experience.name || 'Anonymous'}</p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-wider opacity-70">
                            {experience.year ? `Batch ${experience.year}` : `Exp ${selectedCompany.experiences.length - idx}`}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              {/* Main Reading Area */}
              <div className="flex-1 overflow-y-auto bg-[var(--background)] px-6 py-8 sm:px-12">
                <div className="mx-auto max-w-2xl">
                  {/* Experience Header */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>
                      {activeExperience.name || 'Anonymous Candidate'}
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {activeExperience.year && (
                        <span className="inline-flex items-center rounded-lg bg-[var(--muted)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                          <FiCalendar className="mr-2 h-4 w-4 text-[var(--primary)]" />
                          Batch of {activeExperience.year}
                        </span>
                      )}
                      {activeExperience.hiringProcess && (
                        <span className="inline-flex items-center rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                          {activeExperience.hiringProcess}
                        </span>
                      )}
                      {activeExperience.rounds && (
                        <span className="inline-flex items-center rounded-lg bg-[var(--card)] border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--muted-foreground)]">
                          {activeExperience.rounds}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Media (if any) */}
                  {activeExperience.photoUrl && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                      {isPdfUrl(activeExperience.photoUrl) ? (
                        <PdfViewer url={activeExperience.photoUrl} title={`${selectedCompany.company} media`} />
                      ) : (
                        <img src={activeExperience.photoUrl} alt="Experience media" className="max-h-[500px] w-full object-cover" />
                      )}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="prose prose-invert prose-p:text-[var(--foreground)]/90 prose-p:leading-8 prose-p:text-base max-w-none pb-12">
                    {renderDescription(activeExperience.description) || (
                      <p className="italic text-[var(--muted-foreground)]">No detailed write-up provided.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Sidebar Toggle (Only visible on small screens when >1 exp) */}
            {selectedCompany.experiences.length > 1 && (
              <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3 md:hidden flex overflow-x-auto gap-2">
                {selectedCompany.experiences.map((experience, idx) => (
                  <button
                    key={experience.id}
                    onClick={() => setActiveExperienceId(experience.id)}
                    className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                      activeExperience.id === experience.id
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    {experience.name || `Exp ${selectedCompany.experiences.length - idx}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default InterviewExperiences;
