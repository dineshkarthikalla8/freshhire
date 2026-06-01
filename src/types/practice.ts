export type Problem = {
  id: number;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode' | 'GeeksforGeeks' | 'SPOJ';
  url: string;
};