import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import { db, hasValidFirebaseConfig } from '../../config/firebase';

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

type ContentCategory = 'aptitude' | 'reasoning' | 'verbal' | 'course';

type StudyQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type ContentItem = {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  focus: string[];
  examples: string[];
  tips: string[];
  formulas: string[];
  source: string;
  order: number;
  quiz?: StudyQuiz;
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
  source: '',
  order: 0,
  quiz: {
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  },
};

export const AdminContentStudio = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem>(emptyItem);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasValidFirebaseConfig) return;

    const unsubscribe = onSnapshot(collection(db, 'studyContent'), (snapshot) => {
      const nextItems = snapshot.docs.map((record) => {
        const data = record.data() as Partial<ContentItem>;
        return {
          id: record.id,
          category: (data.category || 'course') as ContentCategory,
          title: data.title || '',
          description: data.description || '',
          focus: data.focus || [],
          examples: data.examples || [],
          tips: data.tips || [],
          formulas: data.formulas || [],
          source: data.source || '',
          order: data.order || 0,
          quiz: data.quiz || { question: '', options: [], answer: '', explanation: '' },
        };
      });
      setItems(nextItems.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)));
    }, (error) => {
      console.error(error);
      toast.error('Failed to load study content');
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => [item.id, item.title, item.category, item.description, item.source]
      .join(' ')
      .toLowerCase()
      .includes(query));
  }, [items, search]);

  const handleSave = async () => {
    if (!editingItem.id.trim() || !editingItem.title.trim()) {
      toast.error('Topic ID and title are required');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'studyContent', editingItem.id.trim()), {
        ...editingItem,
        id: editingItem.id.trim(),
        title: editingItem.title.trim(),
        description: editingItem.description.trim(),
        source: editingItem.source.trim(),
        focus: editingItem.focus,
        examples: editingItem.examples,
        tips: editingItem.tips,
        formulas: editingItem.formulas,
        order: Number(editingItem.order) || 0,
        quiz: editingItem.quiz?.question?.trim()
          ? {
              question: editingItem.quiz.question.trim(),
              options: editingItem.quiz.options.map((option) => option.trim()).filter(Boolean),
              answer: editingItem.quiz.answer.trim(),
              explanation: editingItem.quiz.explanation.trim(),
            }
          : null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Content saved');
      setEditingItem(emptyItem);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save content');
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

  const loadItem = (item: ContentItem) => {
    setEditingItem({
      ...item,
      focus: item.focus || [],
      examples: item.examples || [],
      tips: item.tips || [],
      formulas: item.formulas || [],
      quiz: item.quiz || { question: '', options: ['', '', '', ''], answer: '', explanation: '' },
    });
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
            <button type="button" onClick={() => setEditingItem(emptyItem)} className="btn-outline inline-flex items-center gap-2 px-4 py-3 text-sm">
              <FiPlus /> New
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black">Saved items</h3>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{filteredItems.length} items</span>
          </div>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => loadItem(item)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{item.category}</p>
                    <h4 className="mt-1 text-base font-bold">{item.title}</h4>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={(event) => { event.stopPropagation(); loadItem(item); }} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold">
                      Edit
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); void handleDelete(item.id); }} className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                      <FiTrash2 className="inline-block" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
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
                  <option value="course">Course / Module</option>
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

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Focus areas</span>
                <textarea value={editingItem.focus.join('\n')} onChange={(event) => setField('focus', splitLines(event.target.value))} className="input-field min-h-24" placeholder="One focus area per line" />
              </label>
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Examples</span>
                <textarea value={editingItem.examples.join('\n')} onChange={(event) => setField('examples', splitLines(event.target.value))} className="input-field min-h-24" placeholder="One example per line" />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Tips and tricks</span>
                <textarea value={editingItem.tips.join('\n')} onChange={(event) => setField('tips', splitLines(event.target.value))} className="input-field min-h-24" placeholder="One tip per line" />
              </label>
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Formulas</span>
                <textarea value={editingItem.formulas.join('\n')} onChange={(event) => setField('formulas', splitLines(event.target.value))} className="input-field min-h-24" placeholder="One formula per line" />
              </label>
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
                  <input value={editingItem.quiz?.answer || ''} onChange={(event) => setQuizField('answer', event.target.value)} className="input-field" placeholder="Option text" />
                </label>
                <label className="space-y-1 text-sm block">
                  <span className="font-semibold">Explanation</span>
                  <input value={editingItem.quiz?.explanation || ''} onChange={(event) => setQuizField('explanation', event.target.value)} className="input-field" placeholder="Why this answer is correct" />
                </label>
              </div>
            </div>

            <button type="button" onClick={handleSave} disabled={saving} className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3.5 text-sm">
              <FiSave /> {saving ? 'Saving...' : 'Save content'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
