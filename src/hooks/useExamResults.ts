import { useCallback, useState, useEffect } from 'react';
import type { ExamAttempt, ExamResult } from '../types/company-exams';
import { getExamHistoryFromDB, saveExamHistoryToDB, clearExamHistoryDB } from '../utils/indexedDB';

export const useExamResults = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    getExamHistoryFromDB().then((data) => {
      if (mounted) {
        setResults(data as ExamResult[]);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Save results to IndexedDB whenever they change after initial load
  useEffect(() => {
    if (isLoaded) {
      saveExamHistoryToDB(results);
    }
  }, [results, isLoaded]);

  const saveAttempt = useCallback((attempt: ExamAttempt) => {
    setResults((prev) => {
      const existingResult = prev.find((r) => r.examId === attempt.examId);

      if (existingResult) {
        const updated = {
          ...existingResult,
          attempts: [...existingResult.attempts, attempt],
          lastAttemptDate: attempt.endTime,
        };

        // Calculate best score
        const scores = updated.attempts.map((a) => a.percentage || 0);
        updated.bestPercentage = Math.max(...scores);
        updated.bestScore = Math.max(
          ...updated.attempts.map((a) => a.score || 0)
        );
        updated.isPassed = updated.attempts.some((a) => a.isPassed);

        return prev.map((r) => (r.examId === attempt.examId ? updated : r));
      } else {
        const newResult: ExamResult = {
          examId: attempt.examId,
          company: attempt.company,
          examTitle: attempt.examTitle,
          attempts: [attempt],
          bestScore: attempt.score,
          bestPercentage: attempt.percentage,
          isPassed: attempt.isPassed,
          lastAttemptDate: attempt.endTime,
        };
        return [...prev, newResult];
      }
    });
  }, []);

  const getExamResult = useCallback(
    (examId: string) => results.find((r) => r.examId === examId),
    [results]
  );

  const getAllResults = useCallback(() => results, [results]);

  const getCompanyResults = useCallback(
    (company: string) => results.filter((r) => r.company === company),
    [results]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    clearExamHistoryDB();
  }, []);

  return {
    results,
    saveAttempt,
    getExamResult,
    getAllResults,
    getCompanyResults,
    clearResults,
    isLoaded,
  };
};
