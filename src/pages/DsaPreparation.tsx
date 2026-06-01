import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { useStudyContent } from '../context/StudyContentContext';
import { PremiumPaywall } from '../components/PremiumPaywall';


export const DsaPreparation = () => {
  const { user, authSettings, refreshUser } = useAuth();
  const { topicId } = useParams();
  const { dsaTopics } = useStudyContent();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Get all dynamic questions from all topics to build localCompleted fallbacks
  const allQuestions = useMemo(() => {
    return dsaTopics.flatMap(t => t.questions || []);
  }, [dsaTopics]);

  // Load progress
  useEffect(() => {
    const fetchProgress = async () => {
      const localCompleted: Record<string, boolean> = {};
      allQuestions.forEach((q) => {
        if (localStorage.getItem(`progress_v1_${q.id}`) === 'true') {
          localCompleted[q.id] = true;
        }
      });
      setCompleted(localCompleted);

      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid, 'data', 'dsa_progress');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fbProgress = docSnap.data().progress || {};
            setCompleted({ ...localCompleted, ...fbProgress });
          }
        } catch (e) {
          console.error('Failed to fetch DSA progress', e);
        }
      }
    };
    fetchProgress();
  }, [user, allQuestions]);

  const handleToggle = async (id: string) => {
    const newCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(newCompleted);
    localStorage.setItem(`progress_v1_${id}`, String(newCompleted[id]));
    
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid, 'data', 'dsa_progress');
        await setDoc(docRef, { progress: newCompleted }, { merge: true });
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    }
  };

  const handleSolve = (url: string, id: string) => {
    // Open url in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    // Automatically mark as solved / progress target reached
    if (!completed[id]) {
      handleToggle(id);
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = allQuestions.length;
  const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // Sync to Dashboard
  useEffect(() => {
    if (allQuestions.length === 0) return;
    try {
      const stored = localStorage.getItem('freshhire_progress');
      const parsed = stored ? JSON.parse(stored) : {};
      
      const newStats = {
        ...(parsed.stats || {}),
        dsaSolved: completedCount
      };

      const defaultRoadmaps = [
        { title: 'Curated DSA Pathway', progress: 0, problems: `Tracked`, to: '/dsa' },
        { title: 'Aptitude Prep', progress: 0, problems: 'Tracked', to: '/aptitude' },
        { title: 'Reasoning & Logic', progress: 0, problems: 'Tracked', to: '/reasoning' }
      ];
      
      const roadmaps = parsed.roadmaps || defaultRoadmaps;
      const updatedRoadmaps = roadmaps.map((r: any) => {
        if (r.title === 'Top 150 DSA' || r.title === 'Curated DSA Pathway') {
          return { ...r, title: 'Curated DSA Pathway', progress: progressPercent, problems: `${completedCount}/${totalCount}` };
        }
        return r;
      });

      const grouped = dsaTopics.reduce((acc: any, topic: any) => {
        acc[topic.title] = {
          total: (topic.questions || []).length,
          solved: (topic.questions || []).filter((q: any) => completed[q.id]).length
        };
        return acc;
      }, {});

      const topicProgress = Object.keys(grouped).map(t => ({
        name: t,
        pct: Math.round((grouped[t].solved / grouped[t].total) * 100) || 0
      })).slice(0, 4);

      // Generate dynamic activity flow graph
      const defaultDsaData = [
        { topic: 'Mon', solved: 0 },
        { topic: 'Tue', solved: 0 },
        { topic: 'Wed', solved: 0 },
        { topic: 'Thu', solved: 0 },
        { topic: 'Fri', solved: 0 },
        { topic: 'Sat', solved: 0 },
        { topic: 'Sun', solved: 0 },
      ];
      
      let dsaData = defaultDsaData.map(d => ({ ...d }));
      let heatmap = Array.from({ length: 7 * 12 }, () => 0);

      if (completedCount > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayName = days[new Date().getDay()];
        
        let remaining = completedCount;
        const todaySolve = Math.min(remaining, Math.max(1, Math.floor(remaining * 0.4)));
        
        const todayEntry = dsaData.find(d => d.topic === todayName);
        if (todayEntry) todayEntry.solved = todaySolve;
        remaining -= todaySolve;
        
        if (remaining > 0) {
            const otherDays = dsaData.filter(d => d.topic !== todayName);
            for (let i = 0; i < remaining; i++) {
               otherDays[i % otherDays.length].solved += 1;
            }
        }

        for (let i = 0; i < completedCount; i++) {
           heatmap[heatmap.length - 1 - (i % 14)] += 1;
        }
      }

      localStorage.setItem('freshhire_progress', JSON.stringify({
        ...parsed,
        stats: newStats,
        roadmaps: updatedRoadmaps,
        topicProgress,
        dsaData,
        heatmap
      }));
    } catch (e) {
      console.error('Error syncing dashboard progress', e);
    }
  }, [completed, completedCount, totalCount, progressPercent, allQuestions, dsaTopics]);
  


  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  // Filter topics based on search query for sidebar
  const filteredDsaTopics = useMemo(() => {
    if (!searchQuery.trim()) return dsaTopics;
    const query = searchQuery.toLowerCase().trim();
    return dsaTopics.filter((topic) => {
      const topicMatches =
        topic.title.toLowerCase().includes(query) ||
        (topic.description && topic.description.toLowerCase().includes(query));
      const questionMatches = (topic.questions || []).some(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.difficulty.toLowerCase().includes(query)
      );
      return topicMatches || questionMatches;
    });
  }, [dsaTopics, searchQuery]);

  // Auto-switch to the first matching topic if the current active topic doesn't match the search
  useEffect(() => {
    if (searchQuery.trim() && filteredDsaTopics.length > 0) {
      const currentActiveStillMatches = filteredDsaTopics.some(t => t.title === activeTopic);
      if (!currentActiveStillMatches) {
        setActiveTopic(filteredDsaTopics[0].title);
      }
    }
  }, [searchQuery, filteredDsaTopics, activeTopic]);

  useEffect(() => {
    if (dsaTopics.length > 0 && !activeTopic) {
      if (topicId) {
        const match = dsaTopics.find(t => 
          t.id === topicId || 
          t.id === `dsa-${topicId}` || 
          t.id === `dsa-${topicId}s` || 
          t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === topicId ||
          t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === `${topicId}s` ||
          t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === topicId.replace(/s$/, '')
        );
        setActiveTopic(match ? match.title : dsaTopics[0].title);
      } else {
        setActiveTopic(dsaTopics[0].title);
      }
    }
  }, [dsaTopics, topicId, activeTopic]);

  const scrollToTopic = (topic: string) => {
    setActiveTopic(topic);
  };

  const activeTopicObj = useMemo(() => {
    return dsaTopics.find(t => t.title === activeTopic) || dsaTopics[0];
  }, [dsaTopics, activeTopic]);

  const filteredQuestions = useMemo(() => {
    if (!activeTopicObj) return [];
    const questions = activeTopicObj.questions || [];
    if (!searchQuery.trim()) return questions;

    const query = searchQuery.toLowerCase().trim();
    const isTopicMatch = activeTopicObj.title.toLowerCase().includes(query);

    return questions.filter((q) => 
      isTopicMatch ||
      q.title.toLowerCase().includes(query) || 
      q.difficulty.toLowerCase().includes(query)
    );
  }, [activeTopicObj, searchQuery]);

  if (authSettings.pricingMode === 'paid' && !user?.hasPaid) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <PremiumPaywall user={user} refreshUser={refreshUser} originalPrice={authSettings.premiumPrice ?? 299} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--background)] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-[var(--border)] bg-[var(--card)] p-6 flex flex-col h-full overflow-y-auto shrink-0">
        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--muted-foreground)] mb-4">Search Topics</h3>
        <input 
          type="text" 
          placeholder="Search title, difficulty" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] mb-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
        <p className="text-xs text-[var(--muted-foreground)] mb-6">Showing {filteredQuestions.length} questions in this topic.</p>

        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-[var(--foreground)]">Progress</span>
            <span className="font-bold text-sm text-[var(--foreground)]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[var(--primary)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)]">Saved locally in this browser.</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--muted-foreground)]">Topics</h3>
          <span className="text-xs font-bold text-[var(--muted-foreground)]">{filteredDsaTopics.length}</span>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {filteredDsaTopics.map(topic => {
            const qList = topic.questions || [];
            const tTotal = qList.length;
            const tCompleted = qList.filter(q => completed[q.id]).length;
            const isDone = tCompleted === tTotal && tTotal > 0;
            const isActive = activeTopic === topic.title;
            
            return (
              <button
                key={topic.id}
                onClick={() => scrollToTopic(topic.title)}
                className={`w-full flex flex-col p-3 rounded-xl border transition-all text-left ${
                  isActive 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[var(--glow-red)]' 
                    : 'border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--background)]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-[var(--primary)]'}`}></div>
                    <span className={`text-sm font-bold ${isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{topic.title}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${isDone ? 'bg-green-500/10 text-green-500' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                    {tTotal ? Math.round((tCompleted / tTotal) * 100) : 0}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[var(--background)] relative">
        {/* Background Decorative Glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--primary)]/5 blur-[120px]" />
        
        <div className="max-w-[1000px] mx-auto pb-20 relative z-10">
          {(!activeTopicObj) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-[var(--foreground)] font-bold text-lg mb-1">No DSA topics found</p>
              <p className="text-[var(--muted-foreground)] text-sm">Please define DSA topics in the content studio.</p>
            </div>
          ) : (() => {
            const topicCompleted = (activeTopicObj.questions || []).filter(q => completed[q.id]).length;
            const topicTotal = (activeTopicObj.questions || []).length;
            const isTopicDone = topicCompleted === topicTotal && topicTotal > 0;

            return (
              <div key={activeTopicObj.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Topic Header as a Glass Card */}
                <div className="glass-card overflow-hidden p-8 mb-6 border border-[var(--border)] rounded-[2rem] shadow-sm relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-orange-500"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          isTopicDone ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]'
                        }`}>
                          {isTopicDone ? 'Topic Mastered' : `Topic Progress: ${topicTotal ? Math.round((topicCompleted / topicTotal) * 100) : 0}%`}
                        </span>
                      </div>
                      <h2 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] font-heading" style={{ fontFamily: 'var(--heading-font)' }}>
                        {activeTopicObj.title}
                      </h2>
                      {activeTopicObj.description && (
                        <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{activeTopicObj.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] min-w-[100px]">
                        <span className="text-2xl font-black text-[var(--foreground)]">{topicTotal ? Math.round((topicCompleted / topicTotal) * 100) : 0}%</span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Progress Indicators Inside Active Topic */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--border)]/60">
                    {/* Topic Progress Bar */}
                    <div className="flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Topic Progress</span>
                        <span className="text-xs font-extrabold text-[var(--primary)]">
                          {topicTotal ? Math.round((topicCompleted / topicTotal) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--background)]/60 border border-[var(--border)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-orange-500 rounded-full transition-all duration-500" 
                          style={{ width: `${topicTotal ? Math.round((topicCompleted / topicTotal) * 100) : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Overall DSA Progress Bar */}
                    <div className="flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Overall DSA Progress</span>
                        <span className="text-xs font-extrabold text-green-500">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[var(--background)]/60 border border-[var(--border)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Grid/List */}
                <div className="grid gap-4">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]/50">
                      <p className="text-sm text-[var(--muted-foreground)]">No questions found matching the search criteria.</p>
                    </div>
                  ) : (
                    filteredQuestions.map((q, idx: number) => {
                      const isDone = completed[q.id];
                      return (
                        <div 
                          key={q.id} 
                          className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                            isDone 
                              ? 'bg-[var(--muted)]/20 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' 
                              : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-lg'
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`text-sm font-black ${isDone ? 'text-green-500' : 'text-[var(--muted-foreground)]'}`}>
                                {q.id}.
                              </span>
                              <h4 className={`text-lg font-bold leading-snug line-clamp-2 break-words transition-colors ${
                                isDone ? 'text-[var(--muted-foreground)] line-through' : 'text-[var(--foreground)] group-hover:text-[var(--primary)]'
                              }`}>
                                {q.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                q.difficulty === 'Easy' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                                q.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-600 bg-yellow-500/10' :
                                'border-red-500/30 text-red-500 bg-red-500/10'
                              }`}>
                                {q.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button 
                              onClick={() => handleToggle(q.id)}
                              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                                isDone 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105' 
                                  : 'bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                              }`}
                              title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isDone ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                )}
                              </svg>
                            </button>
                            
                            <button 
                              onClick={() => handleSolve(q.url, q.id)}
                              className="btn-outline px-4 py-2 text-xs font-bold rounded-xl bg-[var(--background)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors flex items-center gap-2"
                            >
                              Solve <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })()}
        </div>
      </div>
      
    </div>
  );
};

export default DsaPreparation;
