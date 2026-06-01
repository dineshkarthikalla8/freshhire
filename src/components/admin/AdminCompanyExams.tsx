import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import { db, hasValidFirebaseConfig } from '../../config/firebase';
import type { CompanyExam, ExamQuestion } from '../../types/company-exams';
import { parseExamMarkdown, type ParsedExam } from '../../utils/examParser';

const safeTrim = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const emptyQuestion: ExamQuestion = {
  id: '',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  difficulty: 'Medium',
};

const emptyExam: CompanyExam = {
  id: '',
  company: '',
  title: '',
  description: '',
  category: 'aptitude',
  totalQuestions: 0,
  duration: 30,
  passingScore: 70,
  questions: [{ ...emptyQuestion }],
};

export const AdminCompanyExams = () => {
  const [exams, setExams] = useState<CompanyExam[]>([]);
  const [editingExam, setEditingExam] = useState<CompanyExam>(emptyExam);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [markdownInput, setMarkdownInput] = useState('');
  const [parseError, setParseError] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedExam | null>(null);

  // Load exams from Firestore
  useEffect(() => {
    if (!hasValidFirebaseConfig) return;

    const unsubscribe = onSnapshot(
      collection(db, 'companyExams'),
      (snapshot) => {
        const nextExams = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<CompanyExam>;
          return {
            id: doc.id,
            company: data.company || '',
            title: data.title || '',
            description: data.description || '',
            category: (data.category || 'aptitude') as any,
            totalQuestions: data.totalQuestions || 0,
            duration: data.duration || 30,
            passingScore: data.passingScore || 70,
            questions: data.questions || [],
          };
        });
        setExams(nextExams);
      },
      (error) => {
        console.error('Failed to load exams:', error);
        toast.error('Failed to load exams');
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredExams = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return exams;
    return exams.filter(
      (exam) =>
        exam.company.toLowerCase().includes(q) ||
        exam.title.toLowerCase().includes(q) ||
        exam.id.toLowerCase().includes(q)
    );
  }, [exams, search]);

  const handleSave = async () => {
    if (!safeTrim(editingExam.id) || !safeTrim(editingExam.company)) {
      toast.error('Exam ID and company are required');
      return;
    }

    if ((editingExam.questions || []).length === 0) {
      toast.error('Add at least one question');
      return;
    }

    setSaving(true);
    try {
      const filtered = (editingExam.questions || [])
        .filter((q) => safeTrim(q.question) && q.options.filter(Boolean).length >= 2)
        .map((q, i) => ({
          ...q,
          id: q.id || String(i),
        }));

      await setDoc(
        doc(db, 'companyExams', editingExam.id.trim()),
        {
          id: editingExam.id.trim(),
          company: editingExam.company.trim(),
          title: editingExam.title.trim(),
          description: editingExam.description.trim(),
          category: editingExam.category,
          totalQuestions: filtered.length,
          duration: editingExam.duration,
          passingScore: editingExam.passingScore,
          questions: filtered,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success('Exam saved');
      setEditingExam(emptyExam);
    } catch (error) {
      console.error('Failed to save exam:', error);
      toast.error('Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      await deleteDoc(doc(db, 'companyExams', id));
      toast.success('Exam deleted');
      if (editingExam.id === id) setEditingExam(emptyExam);
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete exam');
    }
  };

  const addQuestion = () => {
    setEditingExam((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), { ...emptyQuestion, id: String(Date.now()) }],
    }));
  };

  const removeQuestion = (index: number) => {
    setEditingExam((prev) => ({
      ...prev,
      questions: (prev.questions || []).filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index: number, field: keyof ExamQuestion, value: any) => {
    setEditingExam((prev) => {
      const questions = [...(prev.questions || [])];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setEditingExam((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[qIndex]?.options || [])];
      options[oIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, questions };
    });
  };

  const handleParseMarkdown = () => {
    setParseError('');
    setParsedPreview(null);

    if (!markdownInput.trim()) {
      setParseError('Paste markdown content first');
      return;
    }

    try {
      const parsed = parseExamMarkdown(markdownInput);
      setParsedPreview(parsed);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Failed to parse markdown');
    }
  };

  const handleLoadParsedExam = () => {
    if (!parsedPreview) return;

    const questions: ExamQuestion[] = parsedPreview.questions.map((q, i) => ({
      id: String(i),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      explanation: q.explanation,
    }));

    setEditingExam({
      id: parsedPreview.examId,
      company: parsedPreview.company,
      title: parsedPreview.title,
      description: '',
      category: 'aptitude',
      totalQuestions: questions.length,
      duration: parsedPreview.duration,
      passingScore: parsedPreview.passingScore,
      questions,
    });

    setMarkdownInput('');
    setParsedPreview(null);
    setParseError('');
    toast.success(`Loaded ${questions.length} questions from markdown`);
  };

  return (
    <div className="space-y-8">
      <section className="glass-card overflow-hidden rounded-[1.75rem] border border-[var(--border)] p-8 shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-orange-500"></div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between relative z-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--primary)] mb-2">
              Content Studio
            </p>
            <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--heading-font)' }}>Manage platform content</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Create and edit quizzes for Aptitude, Reasoning, Verbal, and Company Exams.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams..."
              className="w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none sm:w-72"
            />
            <button
              onClick={() => setEditingExam(emptyExam)}
              className="btn-outline inline-flex items-center gap-2 px-4 py-3 text-sm"
            >
              <FiPlus /> New Exam
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Markdown Import */}
        {!parsedPreview && (
          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-black">Import from Markdown</h3>
            <div className="space-y-3">
              <label className="space-y-1 text-sm block">
                <span className="font-semibold">Paste .md exam file</span>
                <textarea
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  placeholder={`---
examId: tcs-mock-1
company: TCS
title: Aptitude Mock Test
duration: 60
passingScore: 75
---

## Question

Question: What is the capital of India?

A. Mumbai
B. Delhi
C. Chennai
D. Kolkata

Answer: B
Difficulty: Easy
Explanation: Delhi is the capital of India.

---

## Question

Question: 5 + 7 = ?

A. 10
B. 11
C. 12
D. 13

Answer: C
Difficulty: Easy
Explanation: 5 + 7 = 12.`}
                  className="input-field font-mono text-xs min-h-72"
                />
              </label>

              {parseError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-xs font-semibold text-red-700">Parse Error:</p>
                  <p className="text-xs text-red-600 mt-1 whitespace-pre-wrap break-words">{parseError}</p>
                </div>
              )}

              <button
                onClick={handleParseMarkdown}
                disabled={!markdownInput.trim()}
                className="btn-primary w-full py-2 text-sm disabled:opacity-50"
              >
                Parse Markdown
              </button>
            </div>
          </section>
        )}

        {/* Parse Preview */}
        {parsedPreview && (
          <section className="rounded-[1.5rem] border border-green-200 bg-green-50 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-black text-green-900">Preview</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-green-800">ID:</p>
                <p className="text-green-700">{parsedPreview.examId}</p>
              </div>
              <div>
                <p className="font-semibold text-green-800">Company:</p>
                <p className="text-green-700">{parsedPreview.company}</p>
              </div>
              <div>
                <p className="font-semibold text-green-800">Title:</p>
                <p className="text-green-700">{parsedPreview.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold text-green-800">Duration:</p>
                  <p className="text-green-700">{parsedPreview.duration} min</p>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Passing:</p>
                  <p className="text-green-700">{parsedPreview.passingScore}%</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-green-800">Questions:</p>
                <p className="text-green-700">{parsedPreview.questions.length}</p>
              </div>

              {parsedPreview.questions.length > 0 && (
                <div className="border-t border-green-200 pt-3 mt-3">
                  <p className="font-semibold text-green-800 mb-2">First Question:</p>
                  <p className="text-green-700 text-xs break-words">
                    {parsedPreview.questions[0]?.question.substring(0, 80)}...
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  onClick={handleLoadParsedExam}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  Load & Edit
                </button>
                <button
                  onClick={() => {
                    setParsedPreview(null);
                    setMarkdownInput('');
                    setParseError('');
                  }}
                  className="btn-outline flex-1 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Editor */}
        {!parsedPreview && (
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-black">Exam Editor</h3>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Exam ID</span>
                <input
                  value={editingExam.id}
                  onChange={(e) => setEditingExam((p) => ({ ...p, id: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., tcs-aptitude-01"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Company</span>
                <input
                  value={editingExam.company}
                  onChange={(e) => setEditingExam((p) => ({ ...p, company: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., TCS, Infosys, Wipro"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm block">
              <span className="font-semibold">Exam Title</span>
              <input
                value={editingExam.title}
                onChange={(e) => setEditingExam((p) => ({ ...p, title: e.target.value }))}
                className="input-field"
                placeholder="e.g., Aptitude Mock Exam 1"
              />
            </label>

            <label className="space-y-1 text-sm block">
              <span className="font-semibold">Description</span>
              <textarea
                value={editingExam.description}
                onChange={(e) => setEditingExam((p) => ({ ...p, description: e.target.value }))}
                className="input-field min-h-16"
                placeholder="Brief description of the exam"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="font-semibold text-[var(--primary)]">Category (Important)</span>
                <select
                  value={editingExam.category}
                  onChange={(e) =>
                    setEditingExam((p) => ({ ...p, category: e.target.value as any }))
                  }
                  className="input-field border-[var(--primary)]/30 focus:border-[var(--primary)] bg-[var(--primary)]/5"
                >
                  <option value="aptitude">🎯 Aptitude</option>
                  <option value="dsa">💻 DSA</option>
                  <option value="reasoning">🧠 Reasoning</option>
                  <option value="verbal">🗣️ Verbal</option>
                  <option value="mixed">🏢 Company Exam (Mixed)</option>
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Duration (min)</span>
                <input
                  type="number"
                  value={editingExam.duration}
                  onChange={(e) =>
                    setEditingExam((p) => ({ ...p, duration: parseInt(e.target.value) || 30 }))
                  }
                  className="input-field"
                  min="5"
                  max="300"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-semibold">Passing Score (%)</span>
                <input
                  type="number"
                  value={editingExam.passingScore}
                  onChange={(e) =>
                    setEditingExam((p) => ({ ...p, passingScore: parseInt(e.target.value) || 70 }))
                  }
                  className="input-field"
                  min="0"
                  max="100"
                />
              </label>
            </div>

            {/* Questions */}
            <div className="border-t border-[var(--border)] pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-sm">Questions ({editingExam.questions?.length || 0})</span>
                <button
                  onClick={addQuestion}
                  className="text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  + Add Question
                </button>
              </div>

              <div className="space-y-4">
                {(editingExam.questions || []).map((q, qIdx) => (
                  <div key={qIdx} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/30 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--muted-foreground)]">
                        Question {qIdx + 1}
                      </span>
                      <button
                        onClick={() => removeQuestion(qIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                      className="input-field mb-3 min-h-12 text-sm"
                      placeholder="Enter question text"
                    />

                    <div className="mb-3 space-y-2">
                      {(q.options || []).map((opt, oIdx) => (
                        <input
                          key={oIdx}
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          className="input-field py-2 text-sm"
                          placeholder={`Option ${oIdx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="mb-3 grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-sm">
                        <span className="font-semibold text-xs">Correct Answer</span>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="">-- Select --</option>
                          {q.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              Option {i + 1}: {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="font-semibold text-xs">Difficulty</span>
                        <select
                          value={q.difficulty || 'Medium'}
                          onChange={(e) => updateQuestion(qIdx, 'difficulty', e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </label>
                    </div>

                    <textarea
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                      className="input-field text-sm"
                      placeholder="Explanation for the answer"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3.5 text-sm"
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Exam'}
            </button>
          </div>
        </section>
        )}

        {/* Exams List */}
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-black">Browse Exams</h3>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto">
            {filteredExams.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted-foreground)]">
                No exams found
              </div>
            ) : (
              filteredExams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setEditingExam(exam)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    editingExam.id === exam.id
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                      : 'border-[var(--border)] bg-[var(--background)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          exam.category === 'aptitude' ? 'border-blue-500/30 text-blue-500 bg-blue-500/10' :
                          exam.category === 'reasoning' ? 'border-purple-500/30 text-purple-500 bg-purple-500/10' :
                          exam.category === 'verbal' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                          'border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/10'
                        }`}>
                          {exam.category}
                        </span>
                      </div>
                      <h4 className="truncate font-bold text-sm">{exam.title}</h4>
                      <p className="text-xs text-[var(--muted-foreground)]">{exam.company}</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)] font-semibold">
                        {exam.totalQuestions} questions • {exam.duration} min
                      </p>
                    </div>
                    {editingExam.id === exam.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(exam.id);
                        }}
                        className="shrink-0 text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
