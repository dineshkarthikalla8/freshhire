import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ModuleHero } from '../components/ui/ModuleHero';
import { FiSearch } from 'react-icons/fi';
import { useStudyContent } from '../context/StudyContentContext';
import { useAuth } from '../context/AuthContext';
import { PremiumPaywall } from '../components/PremiumPaywall';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';


export const Practice = () => {
  const { user, authSettings, refreshUser } = useAuth();
  const { dsaTopics } = useStudyContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Get all dynamic questions from all topics to track overall stats
  const allQuestions = useMemo(() => {
    return dsaTopics.flatMap((t) => t.questions || []);
  }, [dsaTopics]);

  // Load progress for all topics
  useEffect(() => {
    const localCompleted: Record<string, boolean> = {};
    allQuestions.forEach((q) => {
      if (localStorage.getItem(`progress_v1_${q.id}`) === 'true') {
        localCompleted[q.id] = true;
      }
    });
    setCompleted(localCompleted);

    if (user?.uid) {
      const fetchProgress = async () => {
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
      };
      fetchProgress();
    }
  }, [user, allQuestions]);

  const solvedQuestionsCount = Object.values(completed).filter(Boolean).length;
  const totalQuestionsCount = allQuestions.length;
  const completionRate = totalQuestionsCount ? Math.round((solvedQuestionsCount / totalQuestionsCount) * 100) : 0;

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return dsaTopics;
    const query = searchQuery.toLowerCase().trim();
    return dsaTopics.filter((topic) => {
      const topicMatches =
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query);
      const questionMatches = (topic.questions || []).some(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.difficulty.toLowerCase().includes(query)
      );
      return topicMatches || questionMatches;
    });
  }, [dsaTopics, searchQuery]);

  if (authSettings.pricingMode === 'paid' && !user?.hasPaid) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <PremiumPaywall user={user} refreshUser={refreshUser} originalPrice={authSettings.premiumPrice ?? 299} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="DSA Practice"
        title={
          <>
            Placement Prep — <span className="text-[var(--primary)]">focused DSA tracks</span>
          </>
        }
        description="Master data structures and algorithms with topic-wise practice questions. Progress saves locally and syncs to your account."
        stats={[
          { label: 'Progress', value: `${completionRate}%` },
          { label: 'Topics', value: String(dsaTopics.length) },
        ]}
        actions={
          <div className="relative w-full sm:max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or problems..."
              className="input-field pl-10"
            />
          </div>
        }
      />

      <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 via-[var(--card)] to-[var(--primary)]/5 p-5 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--primary)]">
              {authSettings.pricingMode === 'paid' ? 'Premium access unlocked' : 'Free access'}
            </p>
            <p className="mt-2 text-[var(--foreground)] font-semibold max-w-2xl">
              {authSettings.pricingMode === 'paid' 
                ? 'Thank you for your premium pass support! You have permanent lifetime access to all DSA topics and questions.' 
                : 'All data structures, algorithms, and questions are completely open. No paywall or checkout required.'}
            </p>
          </div>
          <a
            href="#dsa-topics"
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 font-black text-white shadow-lg shadow-rose-500/20 transition-transform hover:-translate-y-0.5"
          >
            Start practicing
          </a>
        </div>
      </div>

      <div id="dsa-topics" className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTopics.map((topic, index) => {
          const qList = topic.questions || [];
          const totalCount = qList.length;
          const completedCount = qList.filter((q) => completed[q.id]).length;
          const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <motion.article
              key={topic.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              className="glass-card flex flex-col p-5 h-full"
            >
              <div className="h-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#ff4d4d]" />
              <h3 className="mt-4 text-lg font-bold leading-tight">{topic.title}</h3>
              {topic.description && (
                <p className="mt-2 text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>
              )}
              <div className="mt-auto pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-[var(--muted-foreground)]">Topic Progress</p>
                  <span className="font-extrabold text-[var(--primary)] text-sm">{percent}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <Link
                  to={`/dsa/${topic.id}`}
                  className="btn-primary mt-4 block py-2.5 text-center text-sm"
                >
                  Open topic
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default Practice;
