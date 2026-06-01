import { useEffect, useMemo, useState } from 'react';
import bundledExams from '../data/bundledExams.json';
import { useExamResults } from '../hooks/useExamResults';
import type { CompanyExam } from '../types/company-exams';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTarget, FiArrowRight, FiFilter } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { PremiumPaywall } from '../components/PremiumPaywall';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, hasValidFirebaseConfig } from '../config/firebase';


export const CompanyExamsList = () => {
  const navigate = useNavigate();
  const { user, authSettings, refreshUser } = useAuth();
  const { getAllResults } = useExamResults();

  const [exams, setExams] = useState<CompanyExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const allResults = getAllResults();

  // Load exams from JSON & Firestore
  useEffect(() => {
    const staticExams = (bundledExams as any[]).map((data) => ({
      id: data.id,
      company: data.company || '',
      title: data.title || '',
      description: data.description || '',
      category: (data.category || 'aptitude') as any,
      totalQuestions: data.totalQuestions || 0,
      duration: data.duration || 30,
      passingScore: data.passingScore || 70,
      questions: data.questions || [],
    }));

    if (!hasValidFirebaseConfig) {
      setExams(staticExams.sort((a, b) => a.company.localeCompare(b.company)));
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'companyExams'), (snapshot) => {
      const dbExams = snapshot.docs.map((doc) => {
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

      const merged = new Map<string, CompanyExam>();
      staticExams.forEach((e) => merged.set(e.id, e));
      dbExams.forEach((e) => merged.set(e.id, e));

      setExams(Array.from(merged.values()).sort((a, b) => a.company.localeCompare(b.company)));
      setIsLoading(false);
    }, (error) => {
      console.error("Error loading remote exams:", error);
      setExams(staticExams.sort((a, b) => a.company.localeCompare(b.company)));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique companies and categories
  const companies = useMemo(() => {
    return Array.from(new Set(exams.map((e) => e.company))).sort();
  }, [exams]);

  const categories = useMemo(() => {
    return Array.from(new Set(exams.map((e) => e.category))).sort();
  }, [exams]);

  // Filter exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      if (selectedCompany && exam.company !== selectedCompany) return false;
      if (selectedCategory && exam.category !== selectedCategory) return false;
      return true;
    });
  }, [exams, selectedCompany, selectedCategory]);

  const getExamStatus = (examId: string) => {
    const result = allResults.find((r: any) => r.examId === examId);
    if (!result) return { status: 'new', icon: null, color: null };
    if (result.isPassed) return { status: 'passed', icon: '✓', color: 'text-green-600' };
    if (result.attempts.length > 0) return { status: 'attempted', icon: '!', color: 'text-yellow-600' };
    return { status: 'new', icon: null, color: null };
  };

  if (authSettings.pricingMode === 'paid' && !user?.hasPaid) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <PremiumPaywall user={user} refreshUser={refreshUser} originalPrice={authSettings.premiumPrice ?? 299} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background)]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]"></div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading exams...</p>
          </div>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background)]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <FiTarget className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
            <h2 className="mt-4 font-black text-xl">No Exams Available</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Check back soon for company-wise mock exams and practice tests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background)] pb-12">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-black">Company Mock Exams</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Prepare for company interviews with real-world mock exams
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--muted-foreground)] mb-2">
              <FiFilter className="inline mr-1" /> Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm outline-none transition hover:border-[var(--primary)]"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--muted-foreground)] mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm outline-none transition hover:border-[var(--primary)]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">No exams match your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => {
              const status = getExamStatus(exam.id);
              const result = allResults.find((r: any) => r.examId === exam.id);

              return (
                <div
                  key={exam.id}
                  className="group rounded-[1.5rem] border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--card)]/50 p-6 transition hover:border-[var(--primary)] hover:shadow-lg"
                >
                  {/* Status Badge */}
                  {status.status !== 'new' && (
                    <div
                      className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        status.color ||
                        'bg-[var(--muted-foreground)]/10 text-[var(--muted-foreground)]'
                      }`}
                    >
                      {status.status === 'passed' && '✓ Passed'}
                      {status.status === 'attempted' && `${result?.attempts.length} Attempts`}
                    </div>
                  )}

                  <h3 className="font-black text-lg line-clamp-2">{exam.title}</h3>
                  <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">{exam.company}</p>

                  {exam.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                      {exam.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-[var(--background)] p-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Questions</p>
                      <p className="mt-1 font-bold text-sm">{exam.totalQuestions}</p>
                    </div>
                    <div className="rounded-lg bg-[var(--background)] p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <FiClock className="h-3 w-3" /> min
                      </div>
                      <p className="mt-1 font-bold text-sm">{exam.duration}</p>
                    </div>
                    <div className="rounded-lg bg-[var(--background)] p-2">
                      <p className="text-xs text-[var(--muted-foreground)]">Pass</p>
                      <p className="mt-1 font-bold text-sm">{exam.passingScore}%</p>
                    </div>
                  </div>

                  {/* Score display if attempted */}
                  {result && result.bestPercentage !== undefined && (
                    <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                      <p className="text-xs text-[var(--muted-foreground)]">Best Score</p>
                      <p className={`mt-1 font-black text-lg ${
                        result.isPassed ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {result.bestPercentage}%
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/company-exams/${exam.id}`)}
                    className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-2 group-hover:gap-3 transition"
                  >
                    {result ? 'Retake' : 'Start'} <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
