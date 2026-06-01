import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bundledExams from '../data/bundledExams.json';
import { useExamResults } from '../hooks/useExamResults';
import type { CompanyExam, ExamResult } from '../types/company-exams';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiRotateCcw, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db, hasValidFirebaseConfig } from '../config/firebase';

export const CompanyExamResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { getExamResult, isLoaded: isResultsLoaded } = useExamResults();

  const [exam, setExam] = useState<CompanyExam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load exam and get result
  useEffect(() => {
    if (!isResultsLoaded) return; // Wait for IndexedDB

    const loadData = async () => {
      if (!examId) {
        toast.error('Invalid exam');
        navigate(-1);
        return;
      }

      try {
        let examData: CompanyExam | null = null;

        // Try static JSON first
        const staticDoc = (bundledExams as any[]).find((d) => d.id === examId);
        if (staticDoc) {
          examData = { ...staticDoc, id: staticDoc.id } as CompanyExam;
        }

        // Try Firestore if config is valid
        if (!examData && hasValidFirebaseConfig) {
          const docRef = doc(db, 'companyExams', examId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            examData = {
              id: docSnap.id,
              company: data.company || '',
              title: data.title || '',
              description: data.description || '',
              category: (data.category || 'aptitude') as any,
              totalQuestions: data.totalQuestions || 0,
              duration: data.duration || 30,
              passingScore: data.passingScore || 70,
              questions: data.questions || [],
            } as CompanyExam;
          }
        }

        if (!examData) {
          toast.error('Exam not found');
          navigate(-1);
          return;
        }

        setExam(examData);

        // Get result from IndexedDB (via hook)
        const examResult = getExamResult(examId);
        if (examResult) {
          setResult(examResult);
        } else {
          toast.error('No attempt found for this exam');
          navigate('/company-exams');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load exam results');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [examId, navigate, getExamResult, isResultsLoaded]);

  if (isLoading || !isResultsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]"></div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!exam || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center max-w-md">
          <p className="text-sm text-[var(--muted-foreground)]">Results not found</p>
          <button
            onClick={() => navigate('/company-exams')}
            className="btn-primary mt-4 inline-block"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const latestAttempt = result.attempts[result.attempts.length - 1];
  const isPassed = latestAttempt?.isPassed;
  const percentage = latestAttempt?.percentage || 0;
  const score = latestAttempt?.score || 0;
  const totalQuestions = exam.questions?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--background)] relative pb-12">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--primary)]/10 to-transparent blur-[120px]" />

      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: 'var(--heading-font)' }}>{exam.title}</h1>
            <p className="text-sm font-bold text-[var(--muted-foreground)]">{exam.company}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 relative z-10">
        {/* Score Card */}
        <div className="glass-card overflow-hidden rounded-[2.5rem] border border-[var(--border)] p-8 sm:p-12 mb-10 shadow-2xl relative">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="text-center relative z-10">
            <div className="mb-6 inline-block relative">
              {/* Circular Progress Ring Mockup */}
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--border)]" />
                <circle 
                  cx="80" cy="80" r="70" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * percentage) / 100} 
                  className={`${isPassed ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${isPassed ? 'text-green-500' : 'text-red-500'}`}>{percentage}%</span>
              </div>
            </div>

            <p className={`mt-2 text-2xl font-extrabold tracking-tight ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
              {isPassed ? 'TEST PASSED 🎉' : 'TEST FAILED 💔'}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Your Score</p>
                <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{score}<span className="text-lg text-[var(--muted-foreground)]">/{totalQuestions}</span></p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Passing Req.</p>
                <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{exam.passingScore}%</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Total Attempts</p>
                <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{result.attempts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-12">
          <h3 className="mb-6 text-2xl font-extrabold" style={{ fontFamily: 'var(--heading-font)' }}>Detailed Review</h3>

          <div className="space-y-4">
            {exam.questions?.map((question: any, idx: number) => {
              const userAnswer = latestAttempt?.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`rounded-[1.5rem] border-2 transition-all duration-300 ${
                    isCorrect
                      ? 'border-green-500/30 bg-[var(--card)] hover:border-green-500/50'
                      : 'border-red-500/30 bg-[var(--card)] hover:border-red-500/50'
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === question.id ? null : question.id
                      )
                    }
                    className="w-full flex items-start justify-between gap-4 p-5"
                  >
                    <div className="flex items-start gap-4 text-left flex-1">
                      <div
                        className={`shrink-0 rounded-xl p-2.5 shadow-sm ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isCorrect ? (
                          <FiCheckCircle className="h-6 w-6" />
                        ) : (
                          <FiXCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-sm uppercase tracking-wider text-[var(--muted-foreground)]">Question {idx + 1}</p>
                        <p className="mt-1 text-base font-semibold text-[var(--foreground)] leading-relaxed">
                          {question.question}
                        </p>
                      </div>
                    </div>
                    <div className={`shrink-0 rounded-full p-2 bg-[var(--background)] border border-[var(--border)] transition-transform ${expandedQuestion === question.id ? 'rotate-180' : ''}`}>
                      <FiChevronDown className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                  </button>

                  {expandedQuestion === question.id && (
                    <div className="border-t border-[var(--border)] bg-[var(--background)]/50 p-6 rounded-b-[1.5rem] space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">
                            Your Answer
                          </p>
                          <p className={`text-sm font-bold ${
                            isCorrect ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {userAnswer || '(Not answered)'}
                          </p>
                        </div>

                        {!isCorrect && (
                          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">
                              Correct Answer
                            </p>
                            <p className="text-sm font-bold text-green-500">
                              {question.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>

                      {question.explanation && (
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 mt-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-2">
                            Explanation
                          </p>
                          <p className="text-sm leading-relaxed text-[var(--foreground)] font-medium">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate(`/company-exams/${examId}`)}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <FiRotateCcw /> Retake Exam
          </button>
          <button
            onClick={() => navigate('/company-exams')}
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            Back to Exams <FiArrowRight />
          </button>
        </div>

        {/* History */}
        {result.attempts.length > 1 && (
          <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="mb-4 font-black">Previous Attempts</h3>
            <div className="space-y-2">
              {result.attempts.map((attempt: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-[var(--background)] p-3 text-sm"
                >
                  <span className="text-[var(--muted-foreground)]">
                    Attempt {idx + 1}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">
                      {attempt.score}/{totalQuestions}
                    </span>
                    <span
                      className={`rounded px-2 py-1 font-bold text-xs ${
                        attempt.isPassed
                          ? 'bg-green-600/20 text-green-600'
                          : 'bg-red-600/20 text-red-600'
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
