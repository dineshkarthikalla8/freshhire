import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, hasValidFirebaseConfig } from '../config/firebase';
import { aptitudeTopics, reasoningTopics, verbalTopics } from '../data/panels';

export type StudyCategory = 'aptitude' | 'reasoning' | 'verbal' | 'course';

export type StudyQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export type StudyContentItem = {
  id: string;
  category: StudyCategory;
  title: string;
  description: string;
  focus: string[];
  examples: string[];
  tips: string[];
  formulas: string[];
  source?: string;
  quiz?: StudyQuiz;
  order?: number;
};

type StudyContentContextValue = {
  aptitudeTopics: StudyContentItem[];
  reasoningTopics: StudyContentItem[];
  verbalTopics: StudyContentItem[];
  courseTopics: StudyContentItem[];
  allTopics: StudyContentItem[];
  getTopicById: (id: string) => StudyContentItem | undefined;
};

const StudyContentContext = createContext<StudyContentContextValue>({
  aptitudeTopics: [],
  reasoningTopics: [],
  verbalTopics: [],
  courseTopics: [],
  allTopics: [],
  getTopicById: () => undefined,
});

const normalizeList = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};

const normalizeItem = (item: any, fallbackCategory: StudyCategory): StudyContentItem | null => {
  if (!item?.id || !item?.title) return null;

  return {
    id: String(item.id),
    category: (item.category || fallbackCategory || 'course') as StudyCategory,
    title: String(item.title),
    description: String(item.description || ''),
    focus: normalizeList(item.focus, []),
    examples: normalizeList(item.examples, []),
    tips: normalizeList(item.tips, []),
    formulas: normalizeList(item.formulas, []),
    source: typeof item.source === 'string' ? item.source : undefined,
    quiz: item.quiz && typeof item.quiz.question === 'string' && Array.isArray(item.quiz.options)
      ? {
          question: String(item.quiz.question),
          options: normalizeList(item.quiz.options, []),
          answer: String(item.quiz.answer || ''),
          explanation: typeof item.quiz.explanation === 'string' ? item.quiz.explanation : undefined,
        }
      : undefined,
    order: typeof item.order === 'number' ? item.order : undefined,
  };
};

const buildStaticTopics = () => {
  const aptitude = aptitudeTopics.map((item: any) => normalizeItem({ ...item, category: 'aptitude' }, 'aptitude')).filter(Boolean) as StudyContentItem[];
  const reasoning = reasoningTopics.map((item: any) => normalizeItem({ ...item, category: 'reasoning' }, 'reasoning')).filter(Boolean) as StudyContentItem[];
  const verbal = verbalTopics.map((item: any) => normalizeItem({ ...item, category: 'verbal' }, 'verbal')).filter(Boolean) as StudyContentItem[];
  return { aptitude, reasoning, verbal };
};

export const StudyContentProvider = ({ children }: { children: ReactNode }) => {
  const [remoteItems, setRemoteItems] = useState<StudyContentItem[]>([]);

  useEffect(() => {
    if (!hasValidFirebaseConfig) return;

    const unsubscribe = onSnapshot(collection(db, 'studyContent'), (snapshot) => {
      const nextItems = snapshot.docs
        .map((doc) => normalizeItem({ id: doc.id, ...doc.data() }, 'course'))
        .filter(Boolean) as StudyContentItem[];
      setRemoteItems(nextItems);
    }, (error) => {
      console.error('Failed to load study content', error);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<StudyContentContextValue>(() => {
    const { aptitude, reasoning, verbal } = buildStaticTopics();
    const merged = [...aptitude, ...reasoning, ...verbal];

    const byId = new Map<string, StudyContentItem>();
    merged.forEach((item) => byId.set(item.id, item));

    remoteItems.forEach((item) => {
      if (item.category === 'course') {
        byId.set(item.id, item);
        return;
      }

      const existing = byId.get(item.id);
      byId.set(item.id, existing ? { ...existing, ...item, category: existing.category } : item);
    });

    const allTopics = Array.from(byId.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));

    return {
      aptitudeTopics: allTopics.filter((item) => item.category === 'aptitude'),
      reasoningTopics: allTopics.filter((item) => item.category === 'reasoning'),
      verbalTopics: allTopics.filter((item) => item.category === 'verbal'),
      courseTopics: allTopics.filter((item) => item.category === 'course'),
      allTopics,
      getTopicById: (id: string) => byId.get(id),
    };
  }, [remoteItems]);

  return <StudyContentContext.Provider value={value}>{children}</StudyContentContext.Provider>;
};

export const useStudyContent = () => useContext(StudyContentContext);
