export type StudyTopicKey = 'dsa' | 'aptitude' | 'reasoning' | 'verbal';

export type TopicSection = {
  title: string;
  description: string;
  focusAreas: string[];
  samplePatterns: string[];
  tips: string[];
  formulas: string[];
};