export type Problem = {
  id: number;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode';
  url: string;
};