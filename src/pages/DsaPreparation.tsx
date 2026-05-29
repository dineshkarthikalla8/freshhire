import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { problems } from '../data/dsa';
import type { Problem } from '../types/practice';
import { useParams } from 'react-router-dom';

export const DsaPreparation = () => {
  const { user } = useAuth();
  const { topicId } = useParams();
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Load progress
  useEffect(() => {
    const fetchProgress = async () => {
      const localCompleted: Record<number, boolean> = {};
      problems.forEach((p: Problem) => {
        if (localStorage.getItem(`progress_v1_${p.id}`) === 'true') {
          localCompleted[p.id] = true;
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
  }, [user]);

  const handleToggle = async (id: number) => {
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

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = problems.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

  // Sync to Dashboard
  useEffect(() => {
    try {
      const stored = localStorage.getItem('freshhire_progress');
      const parsed = stored ? JSON.parse(stored) : {};
      
      const newStats = {
        ...(parsed.stats || {}),
        dsaSolved: completedCount
      };

      const defaultRoadmaps = [
        { title: 'Top 150 DSA', progress: 0, problems: `0/${totalCount}`, to: '/dsa' },
        { title: 'Aptitude Prep', progress: 0, problems: '0/50', to: '/aptitude' },
        { title: 'Reasoning & Logic', progress: 0, problems: '0/40', to: '/reasoning' }
      ];
      
      const roadmaps = parsed.roadmaps || defaultRoadmaps;
      const updatedRoadmaps = roadmaps.map((r: any) => {
        if (r.title === 'Top 150 DSA') {
          return { ...r, progress: progressPercent, problems: `${completedCount}/${totalCount}` };
        }
        return r;
      });

      const grouped = problems.reduce((acc: any, q: any) => {
        if (!acc[q.category]) acc[q.category] = { total: 0, solved: 0 };
        acc[q.category].total++;
        if (completed[q.id]) acc[q.category].solved++;
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
  }, [completed, completedCount, totalCount, progressPercent]);
  
  // Group by topic
  const groupedQuestions = problems.reduce((acc: Record<string, Problem[]>, q: Problem) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, Problem[]>);

  const topics = Object.keys(groupedQuestions);
  
  const [activeTopic, setActiveTopic] = useState<string | null>(() => {
    if (topicId) {
      const match = topics.find(t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-') === topicId);
      return match || topics[0];
    }
    return topics[0] || null;
  });

  // Filter based on search
  const filteredQuestions = problems.filter((q: Problem) => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGrouped = filteredQuestions.reduce((acc: Record<string, Problem[]>, q: Problem) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, Problem[]>);

  const scrollToTopic = (topic: string) => {
    setActiveTopic(topic);
    const element = document.getElementById(`topic-${topic.replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-[var(--background)] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-[var(--border)] bg-[var(--card)] p-6 flex flex-col h-full overflow-y-auto shrink-0">
        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--muted-foreground)] mb-4">Search Topics</h3>
        <input 
          type="text" 
          placeholder="Search title, category, difficulty" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] mb-2 focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
        <p className="text-xs text-[var(--muted-foreground)] mb-6">Showing {filteredQuestions.length} of {totalCount} questions.</p>

        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm text-[var(--foreground)]">Progress</span>
            <span className="font-bold text-sm text-[var(--foreground)]">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[var(--primary)]" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)]">Saved locally in this browser.</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[var(--muted-foreground)]">Topics</h3>
          <span className="text-xs font-bold text-[var(--muted-foreground)]">{topics.length}</span>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {topics.map(topic => {
            const tTotal = groupedQuestions[topic].length;
            const tCompleted = groupedQuestions[topic].filter(q => completed[q.id]).length;
            const isDone = tCompleted === tTotal && tTotal > 0;
            const isActive = activeTopic === topic;
            
            return (
              <button
                key={topic}
                onClick={() => scrollToTopic(topic)}
                className={`w-full flex flex-col p-3 rounded-xl border transition-all ${
                  isActive 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[var(--glow-red)]' 
                    : 'border-[var(--border)] hover:border-[var(--primary)]/40 bg-[var(--background)]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-[var(--primary)]'}`}></div>
                    <span className={`text-sm font-bold ${isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{topic}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${isDone ? 'bg-green-500/10 text-green-500' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                    {tCompleted}/{tTotal}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[var(--background)] relative">
        {/* Background Decorative Glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--primary)]/5 blur-[120px]" />
        
        <div className="max-w-[1000px] mx-auto pb-20 relative z-10">
          {(() => {
            const displayTopic = activeTopic && filteredGrouped[activeTopic] 
              ? activeTopic 
              : Object.keys(filteredGrouped)[0];
              
            if (!displayTopic) {
              return (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <p className="text-[var(--foreground)] font-bold text-lg mb-1">No questions found</p>
                  <p className="text-[var(--muted-foreground)] text-sm">Try adjusting your search filters.</p>
                </div>
              );
            }

            const questions = filteredGrouped[displayTopic];
            const topicCompleted = questions.filter((q: Problem) => completed[q.id]).length;
            const topicTotal = questions.length;
            const isTopicDone = topicCompleted === topicTotal && topicTotal > 0;

            return (
              <div key={displayTopic} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Topic Header as a Glass Card */}
                <div className="glass-card overflow-hidden p-8 mb-6 border border-[var(--border)] rounded-[2rem] shadow-sm relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-orange-500"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          isTopicDone ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]'
                        }`}>
                          {isTopicDone ? 'Topic Mastered' : `Topic Progress: ${topicCompleted}/${topicTotal}`}
                        </span>
                      </div>
                      <h2 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]" style={{ fontFamily: 'var(--heading-font)' }}>
                        {displayTopic}
                      </h2>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] min-w-[100px]">
                        <span className="text-2xl font-black text-[var(--foreground)]">{topicCompleted}</span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Solved</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] min-w-[100px]">
                        <span className="text-2xl font-black text-[var(--foreground)]">{topicTotal}</span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Grid/List */}
                <div className="grid gap-4">
                  {questions.map((q: Problem, idx: number) => {
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
                            <h4 className={`text-lg font-bold truncate transition-colors ${
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
                          
                          <a 
                            href={q.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl bg-[var(--background)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors flex items-center gap-2"
                          >
                            Solve <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })()}
        </div>
      </div>
      
    </div>
  );
};
