export type ExamQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
};

export type CompanyExam = {
  id: string;
  company: string;
  title: string;
  description: string;
  category: 'aptitude' | 'dsa' | 'reasoning' | 'verbal' | 'mixed';
  totalQuestions: number;
  duration: number; // in minutes
  passingScore: number; // percentage
  questions: ExamQuestion[];
  createdAt?: any;
  updatedAt?: any;
};

export type ExamAttempt = {
  id: string;
  examId: string;
  company: string;
  examTitle: string;
  startTime: number;
  endTime?: number;
  answers: Record<string, string>; // questionId -> selectedAnswer
  score?: number;
  percentage?: number;
  isPassed?: boolean;
  duration: number; // in minutes
};

export type ExamResult = {
  examId: string;
  company: string;
  examTitle: string;
  attempts: ExamAttempt[];
  bestScore?: number;
  bestPercentage?: number;
  isPassed?: boolean;
  lastAttemptDate?: number;
};
