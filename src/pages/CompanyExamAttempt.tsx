import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bundledExams from '../data/bundledExams.json';
import { useExamResults } from '../hooks/useExamResults';
import type { CompanyExam, ExamAttempt } from '../types/company-exams';
import { FiClock, FiChevronRight, FiChevronLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const CompanyExamAttempt = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { saveAttempt } = useExamResults();

  const [exam, setExam] = useState<CompanyExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load exam from JSON and check for saved progress
  useEffect(() => {
    const loadExam = () => {
      if (!examId) {
        toast.error('Invalid exam');
        navigate(-1);
        return;
      }

      try {
        const doc = (bundledExams as any[]).find((d) => d.id === examId);

        if (!doc) {
          toast.error('Exam not found');
          navigate(-1);
          return;
        }

        const data = doc as CompanyExam;
        setExam({ ...data, id: doc.id });
        
        // Resume functionality: Check localStorage
        const savedProgress = localStorage.getItem(`exam_progress_${examId}`);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setAnswers(parsed.answers || {});
          setTimeRemaining(parsed.timeRemaining || data.duration * 60);
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
        } else {
          setTimeRemaining(data.duration * 60);
        }
      } catch (error) {
        console.error('Failed to load exam:', error);
        toast.error('Failed to load exam');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [examId, navigate]);

  // Auto-save progress to localStorage
  useEffect(() => {
    if (!exam || isSubmitted) return;
    localStorage.setItem(`exam_progress_${examId}`, JSON.stringify({
      answers,
      timeRemaining,
      currentQuestionIndex,
      lastUpdated: Date.now()
    }));
  }, [answers, timeRemaining, currentQuestionIndex, exam, examId, isSubmitted]);

  // Timer countdown
  useEffect(() => {
    if (!exam || timeRemaining === 0 || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [exam, timeRemaining, isSubmitted]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!exam) return;

    const questions = exam.questions || [];
    const correctAnswers = questions.filter((q: any) => answers[q.id] === q.correctAnswer).length;
    const percentage = (correctAnswers / questions.length) * 100;
    const isPassed = percentage >= exam.passingScore;

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      examId: exam.id,
      company: exam.company,
      examTitle: exam.title,
      startTime: Date.now() - (exam.duration * 60 - timeRemaining) * 1000,
      endTime: Date.now(),
      answers,
      score: correctAnswers,
      percentage: Math.round(percentage),
      isPassed,
      duration: exam.duration,
    };

    saveAttempt(attempt);
    setIsSubmitted(true);
    localStorage.removeItem(`exam_progress_${examId}`);
    toast.success('Exam submitted!');

    // Redirect to results
    setTimeout(() => {
      navigate(`/company-exams/${examId}/results`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]"></div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center max-w-md">
          <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 font-black">Exam Not Available</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">This exam has no questions or is no longer available.</p>
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

  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam.questions.length;
  const progressPercent = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold" style={{ fontFamily: 'var(--heading-font)' }}>{exam.title}</h1>
              <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mt-1">{exam.company}</p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <div className={`rounded-xl border p-3 flex items-center justify-center gap-2 transition-colors ${
                timeRemaining < 60 ? 'border-red-500/50 bg-red-500/10' : 'border-[var(--border)] bg-[var(--card)]'
              }`}>
                <FiClock className={`h-5 w-5 ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-[var(--primary)]'}`} />
                <span className={`text-base font-black tracking-widest ${timeRemaining < 60 ? 'text-red-500' : 'text-[var(--foreground)]'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <div className="hidden sm:flex flex-col items-end justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Answered</span>
                <span className="text-sm font-black text-[var(--foreground)]">{answeredCount} / {totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Question Display */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden rounded-[2rem] border border-[var(--border)] p-8 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]/20"></div>
              
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
                {currentQuestion.difficulty && (
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'border-green-500/30 bg-green-500/10 text-green-500'
                      : currentQuestion.difficulty === 'Medium'
                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600'
                        : 'border-red-500/30 bg-red-500/10 text-red-500'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>

              <h2 className="mb-8 text-2xl font-bold leading-relaxed text-[var(--foreground)]">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options?.map((option: string, idx: number) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const letters = ['A', 'B', 'C', 'D'];
                  
                  return (
                    <label
                      key={idx}
                      className={`group relative flex cursor-pointer items-center rounded-2xl border-2 p-4 transition-all duration-300 ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] scale-[1.01]'
                          : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--muted)]/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(currentQuestion.id, option)}
                        className="sr-only"
                      />
                      
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors ${
                        isSelected 
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-white' 
                          : 'border-[var(--muted-foreground)]/30 text-[var(--muted-foreground)] group-hover:border-[var(--primary)]/50 group-hover:text-[var(--primary)]'
                      }`}>
                        {letters[idx]}
                      </div>
                      
                      <span className={`ml-4 flex-1 text-[15px] font-medium leading-relaxed transition-colors ${
                        isSelected ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground)]'
                      }`}>
                        {option}
                      </span>
                      
                      <div className={`ml-4 shrink-0 transition-transform duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                        <FiCheckCircle className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="btn-outline inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft /> Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="btn-outline inline-flex items-center gap-2 ml-auto"
                  >
                    Next <FiChevronRight />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary inline-flex items-center gap-2 ml-auto"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="glass-card rounded-[2rem] border border-[var(--border)] p-8 lg:sticky lg:top-28 lg:h-fit shadow-xl">
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Question Navigator
            </p>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-5">
              {exam.questions.map((q: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                    idx === currentQuestionIndex
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-110 z-10'
                      : answers[q.id]
                        ? 'border-green-500 bg-green-500/10 text-green-500'
                        : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]/50 hover:bg-[var(--muted)]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 rounded-xl bg-[var(--background)]/50 p-4 border border-[var(--border)] space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)] font-semibold">Answered</span>
                <span className="font-black text-[var(--foreground)] bg-[var(--muted)] px-2 py-1 rounded-md">{answeredCount} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)] font-semibold">Time/Q (avg)</span>
                <span className="font-black text-[var(--foreground)] bg-[var(--muted)] px-2 py-1 rounded-md">
                  {formatTime(Math.floor(timeRemaining / (totalQuestions - currentQuestionIndex || 1)))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
