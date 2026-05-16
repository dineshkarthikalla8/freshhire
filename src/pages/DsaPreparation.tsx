import { useState, useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Mock data for the first 15 questions of the Top 150
const DSA_QUESTIONS = [
  { id: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/two-sum/', gfg: 'https://practice.geeksforgeeks.org/problems/key-pair5616/1' },
  { id: 2, title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', gfg: 'https://practice.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1' },
  { id: 3, title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/contains-duplicate/', gfg: 'https://practice.geeksforgeeks.org/problems/find-duplicates-in-an-array/1' },
  { id: 4, title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/product-of-array-except-self/', gfg: 'https://practice.geeksforgeeks.org/problems/product-array-puzzle4525/1' },
  { id: 5, title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-subarray/', gfg: 'https://practice.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1' },
  
  { id: 6, title: 'Valid Palindrome', topic: 'Two Pointers', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/valid-palindrome/', gfg: 'https://practice.geeksforgeeks.org/problems/palindrome-string0817/1' },
  { id: 7, title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/3sum/', gfg: 'https://practice.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1' },
  { id: 8, title: 'Container With Most Water', topic: 'Two Pointers', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/container-with-most-water/', gfg: 'https://practice.geeksforgeeks.org/problems/container-with-most-water/1' },
  
  { id: 9, title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/valid-parentheses/', gfg: 'https://practice.geeksforgeeks.org/problems/parenthesis-checker2744/1' },
  { id: 10, title: 'Min Stack', topic: 'Stack', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/min-stack/', gfg: 'https://practice.geeksforgeeks.org/problems/get-minimum-element-from-stack/1' },
  
  { id: 11, title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/reverse-linked-list/', gfg: 'https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1' },
  { id: 12, title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/', gfg: 'https://practice.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1' },
  { id: 13, title: 'Linked List Cycle', topic: 'Linked List', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/linked-list-cycle/', gfg: 'https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1' },
  
  { id: 14, title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/invert-binary-tree/', gfg: 'https://practice.geeksforgeeks.org/problems/mirror-tree/1' },
  { id: 15, title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', gfg: 'https://practice.geeksforgeeks.org/problems/height-of-binary-tree/1' },
];

export const DsaPreparation = () => {
  const { hasPaid } = usePayment();
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  // Load from Firestore
  useEffect(() => {
    const fetchProgress = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid, 'data', 'dsa_progress');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCompleted(docSnap.data().progress || {});
          }
        } catch (e) {
          console.error('Failed to fetch DSA progress', e);
        }
      }
    };
    fetchProgress();
  }, [user]);

  const handleToggle = async (id: number) => {
    if (!user) return;
    
    const newCompleted = { ...completed, [id]: !completed[id] };
    setCompleted(newCompleted);
    
    try {
      const docRef = doc(db, 'users', user.uid, 'data', 'dsa_progress');
      await setDoc(docRef, { progress: newCompleted }, { merge: true });
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = DSA_QUESTIONS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

  // Group by topic
  const groupedQuestions = DSA_QUESTIONS.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, typeof DSA_QUESTIONS>);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] p-8">
      <div className="max-w-[1000px] mx-auto">
        
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black mb-4 text-[var(--foreground)] tracking-tight">Top 150 DSA Questions</h2>
          <p className="text-[var(--muted-foreground)] font-medium max-w-[600px] mx-auto">
            The ultimate roadmap for technical interviews. Track your progress and solve curated problems from LeetCode and GeeksforGeeks.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 mb-10 shadow-xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-bold text-xl mb-1">Your Progress</h3>
              <p className="text-sm text-[var(--muted-foreground)] font-medium">Keep going! Consistency is key.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[var(--foreground)]">{completedCount}</span>
              <span className="text-[var(--muted-foreground)] font-medium"> / {totalCount} solved</span>
            </div>
          </div>
          <div className="w-full h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--foreground)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, type: 'spring' }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {hasPaid ? (
            <div className="space-y-8 transition-all duration-500">
              {Object.entries(groupedQuestions).map(([topic, questions]) => (
                <div key={topic} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-lg">
                  <div className="bg-[var(--muted)] px-6 py-4 border-b border-[var(--border)]">
                    <h4 className="font-bold text-lg">{topic}</h4>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {questions.map((q) => (
                      <div key={q.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--muted)]/50 transition-colors">
                        
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleToggle(q.id)}
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                              completed[q.id] 
                                ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]' 
                                : 'border-[var(--muted-foreground)] hover:border-[var(--foreground)]'
                            }`}
                          >
                            {completed[q.id] && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </button>
                          <div>
                            <h5 className={`font-bold text-[var(--foreground)] ${completed[q.id] ? 'line-through opacity-50' : ''}`}>{q.title}</h5>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block ${
                              q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                              q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                              'bg-red-500/10 text-red-600 dark:text-red-400'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-10 sm:ml-0">
                          <a href={q.leetcode} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 13-5.18 5.18a2 2 0 0 1-2.83 0l-5.65-5.66a2 2 0 0 1 0-2.83l5.18-5.18a2 2 0 0 1 2.83 0l5.65 5.66a2 2 0 0 1 0 2.83Z"/><path d="m14 9-2.83 2.83a2 2 0 0 1-2.83 0l-2.83-2.83"/></svg>
                            LeetCode
                          </a>
                          <a href={q.gfg} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted-foreground)] hover:text-[#2f8d46] bg-[var(--background)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 13-5.18 5.18a2 2 0 0 1-2.83 0l-5.65-5.66a2 2 0 0 1 0-2.83l5.18-5.18a2 2 0 0 1 2.83 0l5.65 5.66a2 2 0 0 1 0 2.83Z"/></svg>
                            GFG
                          </a>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-center py-8 text-[var(--muted-foreground)] font-medium">
                More questions coming soon...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 z-10">
              <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-[var(--foreground)] rounded-2xl flex items-center justify-center text-[var(--background)] mb-6 shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 className="text-2xl font-black mb-3">Pathway Locked</h3>
                <p className="text-[var(--muted-foreground)] font-medium mb-8">
                  Get full access to the curated Top 150 DSA tracker, plus deep AI resume improvements for just ₹29.
                </p>
                <button 
                  onClick={() => window.location.href = '/payment'} 
                  className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-black text-lg rounded-xl hover:opacity-90 transition-opacity shadow-xl"
                >
                  Unlock Everything (₹29)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
