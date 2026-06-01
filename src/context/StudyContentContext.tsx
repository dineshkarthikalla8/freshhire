import { createContext, useContext, useMemo, type ReactNode } from 'react';
import bundledStudyContent from '../data/bundledStudyContent.json';
import { aptitudeTopics, reasoningTopics, verbalTopics, dsaTopics } from '../data/panels';

export type StudyCategory = 'aptitude' | 'reasoning' | 'verbal' | 'dsa';

export type StudyQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export type StudyConcept = {
  title: string;
  description: string;
  formulas: string[];
  tips: string[];
};

export type InfoItem = {
  text: string;
  description: string;
};

export type DsaQuestion = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
};

export type StudyContentItem = {
  id: string;
  category: StudyCategory;
  title: string;
  description: string;
  focus: string[];
  examples: string[];
  tips: InfoItem[];
  formulas: InfoItem[];
  content?: string;
  source?: string;
  quiz?: StudyQuiz;
  order?: number;
  pdfUrl?: string;
  pdfName?: string;
  concepts?: StudyConcept[];
  questions?: DsaQuestion[];
};

type StudyContentContextValue = {
  aptitudeTopics: StudyContentItem[];
  reasoningTopics: StudyContentItem[];
  verbalTopics: StudyContentItem[];
  dsaTopics: StudyContentItem[];
  allTopics: StudyContentItem[];
  getTopicById: (id: string) => StudyContentItem | undefined;
};

const StudyContentContext = createContext<StudyContentContextValue>({
  aptitudeTopics: [],
  reasoningTopics: [],
  verbalTopics: [],
  dsaTopics: [],
  allTopics: [],
  getTopicById: () => undefined,
});

const normalizeList = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};

const normalizeInfoList = (value: unknown): InfoItem[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item): InfoItem => {
    if (typeof item === 'string') {
      return { text: item.trim(), description: '' };
    }
    if (item && typeof item === 'object') {
      return {
        text: typeof item.text === 'string' ? item.text.trim() : '',
        description: typeof item.description === 'string' ? item.description.trim() : '',
      };
    }
    return { text: '', description: '' };
  }).filter((item) => item.text.length > 0);
};

const normalizeItem = (item: any, fallbackCategory: StudyCategory): StudyContentItem | null => {
  if (!item?.id || !item?.title) return null;

  let category = (item.category || fallbackCategory || 'dsa') as StudyCategory;
  if (category === 'course' as any) {
    category = 'dsa';
  }

  return {
    id: String(item.id),
    category,
    title: String(item.title),
    description: String(item.description || ''),
    content: typeof item.content === 'string' ? item.content : '',
    focus: normalizeList(item.focus, []),
    examples: normalizeList(item.examples, []),
    tips: normalizeInfoList(item.tips),
    formulas: normalizeInfoList(item.formulas),
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
    pdfUrl: typeof item.pdfUrl === 'string' ? item.pdfUrl : undefined,
    pdfName: typeof item.pdfName === 'string' ? item.pdfName : undefined,
    concepts: Array.isArray(item.concepts)
      ? item.concepts.map((c: any) => ({
          title: String(c.title || ''),
          description: String(c.description || ''),
          formulas: normalizeList(c.formulas, []),
          tips: normalizeList(c.tips, []),
        }))
      : undefined,
    questions: Array.isArray(item.questions)
      ? item.questions.map((q: any) => ({
          id: String(q.id || ''),
          title: String(q.title || ''),
          difficulty: String(q.difficulty || 'Easy') as 'Easy' | 'Medium' | 'Hard',
          url: String(q.url || ''),
        })).filter((q: any) => q.title && q.url)
      : undefined,
  };
};

const buildStaticTopics = () => {
  const aptitude = aptitudeTopics.map((item: any) => normalizeItem({ ...item, category: 'aptitude' }, 'aptitude')).filter(Boolean) as StudyContentItem[];
  const reasoning = reasoningTopics.map((item: any) => normalizeItem({ ...item, category: 'reasoning' }, 'reasoning')).filter(Boolean) as StudyContentItem[];
  const verbal = verbalTopics.map((item: any) => normalizeItem({ ...item, category: 'verbal' }, 'verbal')).filter(Boolean) as StudyContentItem[];
  const dsa = dsaTopics.map((item: any) => normalizeItem({ ...item, category: 'dsa' }, 'dsa')).filter(Boolean) as StudyContentItem[];
  return { aptitude, reasoning, verbal, dsa };
};

export const StudyContentProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<StudyContentContextValue>(() => {
    const remoteItems = (bundledStudyContent as any[])
      .map((doc) => normalizeItem({ id: doc.id, ...doc }, 'dsa'))
      .filter(Boolean) as StudyContentItem[];
    const { aptitude, reasoning, verbal, dsa } = buildStaticTopics();
    const merged = [...aptitude, ...reasoning, ...verbal, ...dsa];

    const byId = new Map<string, StudyContentItem>();
    merged.forEach((item) => byId.set(item.id, item));

    remoteItems.forEach((item) => {
      const existing = byId.get(item.id);
      if (existing) {
        const mergedItem = { ...existing };

        if (item.title) mergedItem.title = item.title;
        if (item.description && item.description.trim()) mergedItem.description = item.description;
        if (item.content && item.content.trim()) mergedItem.content = item.content;
        if (item.source) mergedItem.source = item.source;
        if (item.pdfUrl) mergedItem.pdfUrl = item.pdfUrl;
        if (item.pdfName) mergedItem.pdfName = item.pdfName;
        if (item.order !== undefined) mergedItem.order = item.order;
        if (item.quiz) mergedItem.quiz = item.quiz;

        if (item.focus && item.focus.length > 0) mergedItem.focus = item.focus;
        if (item.examples && item.examples.length > 0) mergedItem.examples = item.examples;
        if (item.tips && item.tips.length > 0) mergedItem.tips = item.tips;
        if (item.formulas && item.formulas.length > 0) mergedItem.formulas = item.formulas;
        if (item.questions && item.questions.length > 0) mergedItem.questions = item.questions;
        if (item.concepts && item.concepts.length > 0) mergedItem.concepts = item.concepts;

        // Preserve the category of the static topic.
        mergedItem.category = existing.category;
        byId.set(item.id, mergedItem);
      } else if (item.category !== 'aptitude') {
        // Keep remote-only topics for the other categories, but avoid
        // injecting extra aptitude cards from remote content.
        byId.set(item.id, item);
        }
    });

    const allTopics = Array.from(byId.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));

    return {
      aptitudeTopics: allTopics.filter((item) => item.category === 'aptitude'),
      reasoningTopics: allTopics.filter((item) => item.category === 'reasoning'),
      verbalTopics: allTopics.filter((item) => item.category === 'verbal'),
      dsaTopics: allTopics.filter((item) => item.category === 'dsa'),
      allTopics,
      getTopicById: (id: string) => byId.get(id),
    };
  }, []);

  return <StudyContentContext.Provider value={value}>{children}</StudyContentContext.Provider>;
};

export const useStudyContent = () => useContext(StudyContentContext);
