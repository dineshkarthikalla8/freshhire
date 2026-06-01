import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import { db, hasValidFirebaseConfig } from '../../config/firebase';
import { useStudyContent, type InfoItem } from '../../context/StudyContentContext';

const safeTrim = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

type ContentCategory = 'aptitude' | 'reasoning' | 'verbal' | 'dsa';

type StudyQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type StudyConcept = {
  title: string;
  description: string;
  formulas: string[];
  tips: string[];
};

type DsaQuestion = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
};

type ContentItem = {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  focus: string[];
  examples: string[];
  tips: InfoItem[];
  formulas: InfoItem[];
  content?: string;
  source: string;
  order: number;
  quiz?: StudyQuiz;
  concepts?: StudyConcept[];
  pdfUrl?: string;
  pdfName?: string;
  questions?: DsaQuestion[];
};

const emptyItem: ContentItem = {
  id: '',
  category: 'aptitude',
  title: '',
  description: '',
  focus: [],
  examples: [],
  tips: [],
  formulas: [],
  content: '',
  source: '',
  order: 0,
  quiz: {
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  },
  concepts: [],
  pdfUrl: '',
  pdfName: '',
  questions: [],
};

export const AdminContentStudio = () => {
  const { allTopics } = useStudyContent();

  const groupedTopics = useMemo(() => {
    const groups: Record<string, typeof allTopics> = {
      aptitude: [],
      reasoning: [],
      verbal: [],
      dsa: [],
    };
    allTopics.forEach((t) => {
      const cat = t.category || 'dsa';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(t);
    });
    // Sort within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
    });
    return groups;
  }, [allTopics]);

  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem>(emptyItem);
  const [search, setSearch] = useState('');
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<ContentCategory>('aptitude');
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    if (!hasValidFirebaseConfig) return;

    const unsubscribe = onSnapshot(collection(db, 'studyContent'), (snapshot) => {
      const nextItems = snapshot.docs.map((record) => {
        const data = record.data() as Partial<ContentItem>;
        let category = (data.category || 'dsa') as ContentCategory;
        if (category === 'course' as any) {
          category = 'dsa';
        }
        return {
          id: record.id,
          category,
          title: data.title || '',
          description: data.description || '',
          content: data.content || '',
          focus: data.focus || [],
          examples: data.examples || [],
          tips: data.tips || [],
          formulas: data.formulas || [],
          source: data.source || '',
          order: data.order || 0,
          quiz: data.quiz || { question: '', options: [], answer: '', explanation: '' },
          concepts: data.concepts || [],
          pdfUrl: data.pdfUrl || '',
          pdfName: data.pdfName || '',
        };
      });
      setItems(nextItems.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)));
    }, (error) => {
      console.error(error);
      toast.error('Failed to load study content');
    });

    return () => unsubscribe();
  }, []);

  const filteredCategoryTopics = useMemo(() => {
    const topics = groupedTopics[selectedSubjectTab] || [];
    const query = search.trim().toLowerCase();
    if (!query) return topics;
    return topics.filter((t) =>
      t.title.toLowerCase().includes(query) || t.id.toLowerCase().includes(query)
    );
  }, [groupedTopics, selectedSubjectTab, search]);

  const handleSave = async () => {
    if (!safeTrim(editingItem.id) || !safeTrim(editingItem.title)) {
      toast.error('Topic ID and title are required');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'studyContent', editingItem.id.trim()), {
        id: editingItem.id.trim(),
        category: editingItem.category || 'dsa',
        title: editingItem.title.trim(),
        description: editingItem.description.trim(),
        content: (editingItem.content || '').trim(),
        source: safeTrim(editingItem.source),
        focus: (editingItem.focus || []).map(safeTrim).filter(Boolean),
        examples: (editingItem.examples || []).map(safeTrim).filter(Boolean),
        tips: (editingItem.tips || [])
          .map((t) => ({ text: safeTrim(t.text), description: safeTrim(t.description) }))
          .filter((t) => t.text),
        formulas: (editingItem.formulas || [])
          .map((f) => ({ text: safeTrim(f.text), description: safeTrim(f.description) }))
          .filter((f) => f.text),
        order: Number(editingItem.order) || 0,
        quiz: safeTrim(editingItem.quiz?.question)
          ? {
              question: safeTrim(editingItem.quiz?.question),
              options: (editingItem.quiz?.options || []).map(safeTrim).filter(Boolean),
              answer: safeTrim(editingItem.quiz?.answer),
              explanation: safeTrim(editingItem.quiz?.explanation),
            }
          : null,
        concepts: (editingItem.concepts || []).map((c) => ({
          title: safeTrim(c.title),
          description: safeTrim(c.description),
          formulas: (c.formulas || []).map(safeTrim).filter(Boolean),
          tips: (c.tips || []).map(safeTrim).filter(Boolean),
        })),
        pdfUrl: editingItem.pdfUrl || null,
        pdfName: editingItem.pdfName || null,
        questions: (editingItem.questions || [])
          .map((q) => ({
            id: safeTrim(q.id),
            title: safeTrim(q.title),
            difficulty: q.difficulty || 'Easy',
            url: safeTrim(q.url),
          }))
          .filter((q) => q.title && q.url),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Content saved');
      setEditingItem(emptyItem);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to save content: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete content for ${id}?`)) return;
    try {
      await deleteDoc(doc(db, 'studyContent', id));
      toast.success('Content deleted');
      if (editingItem.id === id) setEditingItem(emptyItem);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete content');
    }
  };

  const setField = <K extends keyof ContentItem>(field: K, value: ContentItem[K]) => {
    setEditingItem((previous) => ({ ...previous, [field]: value }));
  };

  const addItemField = (field: 'tips' | 'formulas') => {
    const list = [...(editingItem[field] || [])];
    list.push({ text: '', description: '' });
    setField(field, list);
  };

  const removeItemField = (field: 'tips' | 'formulas', index: number) => {
    const list = (editingItem[field] || []).filter((_, i) => i !== index);
    setField(field, list.length > 0 ? list : [{ text: '', description: '' }]);
  };

  const updateItemField = (field: 'tips' | 'formulas', index: number, subField: 'text' | 'description', value: string) => {
    const list = [...(editingItem[field] || [])];
    list[index] = {
      ...list[index],
      [subField]: value,
    };
    setField(field, list);
  };

  const moveItem = (field: 'tips' | 'formulas', index: number, direction: 'up' | 'down') => {
    const list = [...(editingItem[field] || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      setField(field, list);
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      setField(field, list);
    }
  };

  const setQuizField = <K extends keyof StudyQuiz>(field: K, value: StudyQuiz[K]) => {
    setEditingItem((previous) => ({
      ...previous,
      quiz: {
        question: previous.quiz?.question || '',
        options: previous.quiz?.options || ['', '', '', ''],
        answer: previous.quiz?.answer || '',
        explanation: previous.quiz?.explanation || '',
        [field]: value,
      },
    }));
  };

  const addQuestionField = () => {
    const list = [...(editingItem.questions || [])];
    list.push({ id: String(list.length + 1), title: '', difficulty: 'Easy', url: '' });
    setField('questions', list);
  };

  const removeQuestionField = (index: number) => {
    const list = (editingItem.questions || []).filter((_, i) => i !== index);
    setField('questions', list);
  };

  const updateQuestionField = (index: number, subField: keyof DsaQuestion, value: string) => {
    const list = [...(editingItem.questions || [])];
    list[index] = {
      ...list[index],
      [subField]: value,
    };
    setField('questions', list);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const list = [...(editingItem.questions || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      setField('questions', list);
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      setField('questions', list);
    }
  };

  const loadItem = (item: ContentItem) => {
    setEditingItem({
      ...item,
      focus: item.focus || [],
      examples: item.examples || [],
      content: item.content || '',
      tips: item.tips || [],
      formulas: item.formulas || [],
      quiz: item.quiz || { question: '', options: ['', '', '', ''], answer: '', explanation: '' },
      concepts: item.concepts || [],
      questions: item.questions || [],
    });
  };

  const handleCreateNew = () => {
    setEditingItem({
      ...emptyItem,
      category: selectedSubjectTab,
      concepts: [],
      questions: [],
    });
    toast.success(`Editor initialized for new topic under ${selectedSubjectTab.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Content Studio</p>
            <h2 className="mt-2 text-2xl font-black">Manage topics, modules, formulas, tips, and quizzes</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Create or edit content once and it will appear in the study panels for users.</p>
          </div>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search topic/module"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none sm:w-72"
            />
            <button type="button" onClick={handleCreateNew} className="btn-outline inline-flex items-center gap-2 px-4 py-3 text-sm">
              <FiPlus /> New
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column: Editor */}
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 xl:order-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black">Editor</h3>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Firestore: studyContent</span>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Topic ID</span>
                <input value={editingItem.id} onChange={(event) => setField('id', event.target.value)} className="input-field" placeholder="sql-joins, fullstack-basics" />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Category</span>
                <select value={editingItem.category} onChange={(event) => setField('category', event.target.value as ContentCategory)} className="input-field">
                  <option value="aptitude">Aptitude</option>
                  <option value="reasoning">Reasoning</option>
                  <option value="verbal">Verbal</option>
                  <option value="dsa">DSA</option>
                </select>
              </label>
            </div>

            <label className="space-y-1 text-sm block">
              <span className="font-semibold">Title</span>
              <input value={editingItem.title} onChange={(event) => setField('title', event.target.value)} className="input-field" placeholder="SQL Full Stack Basics" />
            </label>

            <label className="space-y-1 text-sm block">
              <span className="font-semibold">Description</span>
              <textarea value={editingItem.description} onChange={(event) => setField('description', event.target.value)} className="input-field min-h-24" placeholder="Short summary for the user panel" />
            </label>

            <label className="space-y-1 text-sm block">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Content (Markdown)</span>
                <span className="text-xs text-[var(--muted-foreground)]">Paste plain .md or text — single-page content</span>
              </div>
              <textarea value={editingItem.content || ''} onChange={(event) => setField('content', event.target.value)} className="input-field min-h-48 font-sans" placeholder="Paste markdown or plain text for full topic content" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Source URL</span>
                <input value={editingItem.source} onChange={(event) => setField('source', event.target.value)} className="input-field" placeholder="https://..." />
              </label>
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Sort order</span>
                <input value={editingItem.order} type="number" onChange={(event) => setField('order', Number(event.target.value))} className="input-field" placeholder="0" />
              </label>
            </div>

            {editingItem.category === 'dsa' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-3">
                  <span className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wider">DSA Coding Questions</span>
                  <button
                    type="button"
                    onClick={addQuestionField}
                    className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  >
                    + Add Question
                  </button>
                </div>
                <div className="space-y-4">
                  {(editingItem.questions || []).length === 0 ? (
                    <button
                      type="button"
                      onClick={addQuestionField}
                      className="w-full py-8 text-center text-xs text-[var(--muted-foreground)] rounded-2xl border border-dashed border-[var(--border)] hover:bg-[var(--muted)]/20 transition cursor-pointer"
                    >
                      No coding questions added yet. Click here to add the first question.
                    </button>
                  ) : (
                    (editingItem.questions || []).map((q, index) => (
                      <div key={index} className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)]/30 p-4 shadow-sm relative">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[var(--muted-foreground)]">Question #{index + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5 shrink-0 bg-[var(--background)] border border-[var(--border)] rounded-lg p-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveQuestion(index, 'up')}
                                className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                title="Move Up"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                disabled={index === (editingItem.questions || []).length - 1}
                                onClick={() => moveQuestion(index, 'down')}
                                className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                title="Move Down"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeQuestionField(index)}
                              className="text-red-500 hover:text-red-700 p-1.5 shrink-0 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                              title="Delete question"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-12">
                          <label className="space-y-1 text-xs block sm:col-span-2">
                            <span className="font-semibold text-[var(--muted-foreground)]">QID / Order</span>
                            <input
                              value={q.id || ''}
                              onChange={(e) => updateQuestionField(index, 'id', e.target.value)}
                              className="input-field py-2 px-3 text-xs"
                              placeholder="e.g. 1"
                            />
                          </label>
                          <label className="space-y-1 text-xs block sm:col-span-7">
                            <span className="font-semibold text-[var(--muted-foreground)]">Question Title</span>
                            <input
                              value={q.title || ''}
                              onChange={(e) => updateQuestionField(index, 'title', e.target.value)}
                              className="input-field py-2 px-3 text-xs font-bold"
                              placeholder="e.g. Two Sum"
                            />
                          </label>
                          <label className="space-y-1 text-xs block sm:col-span-3">
                            <span className="font-semibold text-[var(--muted-foreground)]">Difficulty</span>
                            <select
                              value={q.difficulty || 'Easy'}
                              onChange={(e) => updateQuestionField(index, 'difficulty', e.target.value)}
                              className="input-field py-2 px-3 text-xs"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </label>
                        </div>

                        <label className="space-y-1 text-xs block w-full">
                          <span className="font-semibold text-[var(--muted-foreground)]">Solve URL / Coding Platform Link</span>
                          <input
                            value={q.url || ''}
                            onChange={(e) => updateQuestionField(index, 'url', e.target.value)}
                            className="input-field py-2 px-3 text-xs font-mono text-[var(--primary)]"
                            placeholder="e.g. https://leetcode.com/problems/two-sum/"
                          />
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-sm block">
                    <span className="font-semibold">Focus areas</span>
                    <textarea value={editingItem.focus.join('\n')} onChange={(event) => setField('focus', event.target.value.split('\n'))} className="input-field min-h-24" placeholder="One focus area per line" />
                  </label>
                  <label className="space-y-1 text-sm block">
                    <span className="font-semibold">Examples</span>
                    <textarea value={editingItem.examples.join('\n')} onChange={(event) => setField('examples', event.target.value.split('\n'))} className="input-field min-h-24" placeholder="One example per line" />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Tips and tricks dynamic list */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Tips and tricks</span>
                      <button
                        type="button"
                        onClick={() => addItemField('tips')}
                        className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        + Add Tip/Trick
                      </button>
                    </div>
                    <div className="space-y-3.5">
                      {(editingItem.tips || []).length === 0 ? (
                        <button
                          type="button"
                          onClick={() => addItemField('tips')}
                          className="w-full py-4 text-center text-xs text-[var(--muted-foreground)] rounded-xl border border-dashed border-[var(--border)] hover:bg-[var(--muted)]/20 transition cursor-pointer"
                        >
                          No tips added. Click to add a tip.
                        </button>
                      ) : (
                        (editingItem.tips || []).map((tip, index) => (
                          <div key={index} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-3">
                            <div className="flex items-center gap-2">
                              <input
                                value={tip.text || ''}
                                onChange={(e) => updateItemField('tips', index, 'text', e.target.value)}
                                className="input-field py-1.5 text-xs flex-1 font-bold"
                                placeholder={`Tip/Trick #${index + 1}`}
                              />
                              <div className="flex items-center gap-0.5 shrink-0 bg-[var(--background)] border border-[var(--border)] rounded-lg p-0.5">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveItem('tips', index, 'up')}
                                  className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Up"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  disabled={index === (editingItem.tips || []).length - 1}
                                  onClick={() => moveItem('tips', index, 'down')}
                                  className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Down"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItemField('tips', index)}
                                className="text-red-500 hover:text-red-700 p-1 shrink-0 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                                title="Remove tip"
                              >
                                <FiTrash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <input
                              value={tip.description || ''}
                              onChange={(e) => updateItemField('tips', index, 'description', e.target.value)}
                              className="input-field py-1.5 text-[11px] bg-[var(--background)]/80 text-[var(--muted-foreground)]"
                              placeholder="Brief description / explanation"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Formulas dynamic list */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Formulas</span>
                      <button
                        type="button"
                        onClick={() => addItemField('formulas')}
                        className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        + Add Formula
                      </button>
                    </div>
                    <div className="space-y-3.5">
                      {(editingItem.formulas || []).length === 0 ? (
                        <button
                          type="button"
                          onClick={() => addItemField('formulas')}
                          className="w-full py-4 text-center text-xs text-[var(--muted-foreground)] rounded-xl border border-dashed border-[var(--border)] hover:bg-[var(--muted)]/20 transition cursor-pointer"
                        >
                          No formulas added. Click to add a formula.
                        </button>
                      ) : (
                        (editingItem.formulas || []).map((formula, index) => (
                          <div key={index} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-3">
                            <div className="flex items-center gap-2">
                              <input
                                value={formula.text || ''}
                                onChange={(e) => updateItemField('formulas', index, 'text', e.target.value)}
                                className="input-field py-1.5 text-xs flex-1 font-bold"
                                placeholder={`Formula #${index + 1}`}
                              />
                              <div className="flex items-center gap-0.5 shrink-0 bg-[var(--background)] border border-[var(--border)] rounded-lg p-0.5">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveItem('formulas', index, 'up')}
                                  className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Up"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  disabled={index === (editingItem.formulas || []).length - 1}
                                  onClick={() => moveItem('formulas', index, 'down')}
                                  className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:hover:text-[var(--muted-foreground)] transition cursor-pointer disabled:cursor-not-allowed"
                                  title="Move Down"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItemField('formulas', index)}
                                className="text-red-500 hover:text-red-700 p-1 shrink-0 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                                title="Remove formula"
                              >
                                <FiTrash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <input
                              value={formula.description || ''}
                              onChange={(e) => updateItemField('formulas', index, 'description', e.target.value)}
                              className="input-field py-1.5 text-[11px] bg-[var(--background)]/80 text-[var(--muted-foreground)]"
                              placeholder="Brief description / derivation explanation"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Quiz</p>
                  <label className="space-y-1 text-sm block">
                    <span className="font-semibold">Question</span>
                    <textarea value={editingItem.quiz?.question || ''} onChange={(event) => setQuizField('question', event.target.value)} className="input-field min-h-20" placeholder="Add a multiple-choice question" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(editingItem.quiz?.options || ['', '', '', '']).map((option, index) => (
                      <label key={index} className="space-y-1 text-sm block">
                        <span className="font-semibold">Option {index + 1}</span>
                        <input value={option} onChange={(event) => {
                          const nextOptions = [...(editingItem.quiz?.options || ['', '', '', ''])];
                          nextOptions[index] = event.target.value;
                          setEditingItem((previous) => ({ ...previous, quiz: { ...(previous.quiz || { question: '', options: ['', '', '', ''], answer: '', explanation: '' }), options: nextOptions } }));
                        }} className="input-field" />
                      </label>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-sm block">
                      <span className="font-semibold">Correct answer</span>
                      <select
                        value={editingItem.quiz?.answer || ''}
                        onChange={(event) => setQuizField('answer', event.target.value)}
                        className="input-field"
                      >
                        <option value="">-- Select Correct Option --</option>
                        {(editingItem.quiz?.options || []).map((opt, i) => {
                          const trimmedOpt = safeTrim(opt);
                          return trimmedOpt ? (
                            <option key={i} value={trimmedOpt}>
                              Option {i + 1}: {trimmedOpt}
                            </option>
                          ) : null;
                        })}
                      </select>
                    </label>
                    <label className="space-y-1 text-sm block">
                      <span className="font-semibold">Explanation</span>
                      <input value={editingItem.quiz?.explanation || ''} onChange={(event) => setQuizField('explanation', event.target.value)} className="input-field" placeholder="Why this answer is correct" />
                    </label>
                  </div>
                </div>
              </>
            )}

            <button type="button" onClick={handleSave} disabled={saving} className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3.5 text-sm">
              <FiSave /> {saving ? 'Saving...' : 'Save content'}
            </button>
          </div>
        </section>

        {/* Right Column: Subject & Topic Browser */}
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 xl:order-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black">Browse Topics</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Select a topic to edit its content</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              {filteredCategoryTopics.length} topics
            </span>
          </div>

          {/* Subject Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--background)] rounded-xl border border-[var(--border)] mb-4">
            {(['aptitude', 'reasoning', 'verbal', 'dsa'] as const).map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubjectTab(subj)}
                className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg transition capitalize ${
                  selectedSubjectTab === subj
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]'
                }`}
              >
                {subj === 'dsa' ? 'DSA' : subj}
              </button>
            ))}
          </div>

          {/* Topics List */}
          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredCategoryTopics.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted-foreground)] bg-[var(--background)]">
                No topics found matching "{search}" in this category.
              </div>
            ) : (
              filteredCategoryTopics.map((topic) => {
                const isActive = editingItem.id === topic.id;
                const isCustom = items.some((i) => i.id === topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => loadItem(topic as any)}
                    className={`w-full rounded-2xl border p-4 text-left cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between gap-4 ${
                      isActive
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm shadow-[var(--primary)]/5'
                        : 'border-[var(--border)] bg-[var(--background)]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[var(--foreground)] truncate">{topic.title}</h4>
                        {isCustom && (
                          <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded-full">
                            Firestore
                          </span>
                        )}

                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] truncate">{topic.id}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDelete(topic.id);
                          }}
                          className="rounded-full border border-red-500/20 bg-red-500/10 p-2 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition"
                          title="Delete customizations"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

    </div>
  );
};
