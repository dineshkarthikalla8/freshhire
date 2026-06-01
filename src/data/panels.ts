import backtrackingProblems from './dsa/backtracking';
import bitManipulationProblems from './dsa/bitManipulation';
import binarySearchTreeProblems from './dsa/binarySearchTrees';
import binaryTreeProblems from './dsa/binaryTrees';
import dynamicProgrammingProblems from './dsa/dynamicProgramming';
import heapProblems from './dsa/heap';
import matrixProblems from './dsa/matrix';
import searchingSortingProblems from './dsa/searchingSorting';
import stacksQueuesProblems from './dsa/stacksQueues';
import stringProblems from './dsa/string';
export const dsaTopics = [
  {
    id: 'dsa-matrix',
    title: 'Matrix',
    description: 'Row and column traversal, rotation, and matrix-based search problems.',
    questions: matrixProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-searching-sorting',
    title: 'Searching & Sorting',
    description: 'Binary search, partitioning, merge-sort, and classic sorting problems.',
    questions: searchingSortingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-linked-list',
    title: 'Linked List',
    description: 'Pointer handling, circular lists, reversal, sorting, and classic list operations.',
    questions: [
      { id: 'll-1', title: 'Remove Duplicates in a sorted Linked List', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/remove-duplicates-from-a-sorted-linked-list/1' },
      { id: 'll-2', title: 'Check if a linked list is a circular linked list', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/circular-linked-list/1' },
      { id: 'll-3', title: 'Deletion from a Circular Linked List', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/deletion-in-circular-linked-list/1' },
      { id: 'll-4', title: 'Sort a k sorted Doubly linked list [Very IMP]', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/sort-a-k-sorted-doubly-linked-list/1' },
      { id: 'll-5', title: 'Rotate Doubly Linked list by N nodes', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/rotate-a-doubly-linked-list/1' },
      { id: 'll-6', title: 'Flatten a Linked List', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1' },
      { id: 'll-7', title: 'Segregate even and odd nodes in a Linked List', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/segregate-even-and-odd-nodes-in-a-linked-list/1' },
      { id: 'll-8', title: 'Find the starting point of the loop', difficulty: 'Medium', url: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 'll-9', title: 'Intersection of two Sorted Linked List', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/intersection-of-two-sorted-linked-lists/1' },
      { id: 'll-10', title: 'Intersection Point of two Linked Lists', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/intersection-point-in-y-shapped-linked-lists/1' },
      { id: 'll-11', title: 'Quicksort for Linked Lists [Very Important]', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/quicksort-on-linked-list/1' },
      { id: 'll-12', title: 'Delete nodes which have a greater value on right side', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/delete-nodes-having-greater-value-on-right/1' },
      { id: 'll-13', title: 'Split a Circular linked list into two halves', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/split-a-circular-linked-list-into-two-halves/1' },
      { id: 'll-14', title: 'Write a Program to check whether the Singly Linked list is a palindrome or not', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1' },
      { id: 'll-15', title: 'Count triplets in a sorted DLL whose sum is equal to given value X', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/count-triplets-in-a-dll/1' },
      { id: 'll-16', title: 'Rotate a Doubly Linked list in group of Given Size [Very IMP]', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/rotate-doubly-linked-list-by-n-nodes/1' },
      { id: 'll-17', title: 'Can we reverse a linked list in less than O(n) ?', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1' },
      { id: 'll-18', title: 'Why Quicksort is preferred for Arrays and Merge Sort for Linked Lists ?', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/why-quicksort-is-preferred-for-arrays-and-merge-sort-for-linked-lists/1' },
      { id: 'll-19', title: 'Merge K sorted Linked list', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1' },
      { id: 'll-20', title: 'Write a Program to Move the last element to Front in a Linked List', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/move-last-element-to-front-of-a-linked-list/1' },
      { id: 'll-21', title: 'Reverse a Doubly Linked list', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1' },
      { id: 'll-22', title: 'Write a program to Detect loop in a linked list', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'll-23', title: 'Add 1 to a number represented as a Linked List', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/add-1-to-a-number-represented-as-linked-list/1' },
      { id: 'll-24', title: 'Add two numbers represented by linked lists', difficulty: 'Medium', url: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: 'll-25', title: 'Clone a linked list with next and random pointer', difficulty: 'Hard', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: 'll-26', title: 'Write a Program to reverse the Linked List (Both Iterative and recursive)', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'll-27', title: 'Find the middle Element of a linked list', difficulty: 'Easy', url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 'll-28', title: 'Find pairs with a given sum in a DLL', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1' },
      { id: 'll-29', title: 'Find the first non-repeating character from a stream of characters', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream/0' },
      { id: 'll-30', title: 'Reverse a Linked List in group of Given Size [Very Imp]', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1' },
      { id: 'll-31', title: 'Write a program to Delete loop in a linked list', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1' },
      { id: 'll-32', title: 'Remove Duplicates in an Un-sorted Linked List', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/remove-duplicates-from-an-unsorted-linked-list/1' },
      { id: 'll-33', title: 'Merge Sort For Linked lists [Very Important]', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/merge-sort-on-doubly-linked-list/1' },
      { id: 'll-34', title: "Sort a LL of 0's, 1's and 2's", difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/sort-a-linked-list-of-0s-1s-and-2s/1' },
      { id: 'll-35', title: 'Multiply 2 no. represented by LL', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/multiply-two-linked-lists/1' },
      { id: 'll-36', title: "Program for n’th node from the end of a Linked List", difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1' }
    ]
  },
  {
    id: 'dsa-binary-trees',
    title: 'Binary Trees',
    description: 'Traversal, views, LCA, tree construction, and subtree logic.',
    questions: binaryTreeProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-bst',
    title: 'Binary Search Trees',
    description: 'BST insertion, deletion, LCA, validation, and order-statistics problems.',
    questions: binarySearchTreeProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-greedy',
    title: 'Greedy',
    description: 'Locally optimal choices, interval picking, and exchange arguments.',
    questions: [
      { id: 'g-1', title: 'Minimum Platforms Problem', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1' },
      { id: 'g-2', title: 'Maximize the sum of arr[i]*i', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/maximize-arrii-of-an-array/0' },
      { id: 'g-3', title: 'Picking Up Chicks', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/picking-up-chicks/1' },
      { id: 'g-4', title: 'CHOCOLA - Chocolate', difficulty: 'Hard', url: 'https://www.spoj.com/problems/CHOCOLA/' },
      { id: 'g-5', title: 'Rearrange characters in a string such that no two adjacent are same', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorganize-string/' },
      { id: 'g-6', title: 'Buy Maximum Stocks if i stocks can be bought on i-th day', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/buy-maximum-stocks-if-i-stocks-can-be-bought-on-i-th-day/1' },
      { id: 'g-7', title: 'Find the minimum and maximum amount to buy all N candies', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/minimum-and-maximum-amount-to-buy-all-n-candies/1' },
      { id: 'g-8', title: 'Minimize Cash Flow among a given set of friends who have borrowed money from each other', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/minimize-cash-flow-among-given-set-friends-who-have-borrowed-money-from-each-other/' },
      { id: 'g-9', title: 'Maximum sum of absolute difference of an array', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/maximum-sum-absolute-difference-array/1' },
      { id: 'g-10', title: 'DIEHARD - DIE HARD', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/die-hard/1' },
      { id: 'g-11', title: 'GERGOVIA - Wine trading in Gergovia', difficulty: 'Hard', url: 'https://www.spoj.com/problems/GERGOVIA/' },
      { id: 'g-12', title: 'Minimum sum of absolute difference of pairs of two arrays', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/minimum-sum-of-absolute-differences-of-pairs-of-two-arrays/1' },
      { id: 'g-13', title: 'Program for Shortest Job First (or SJF) CPU Scheduling', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/shortest-job-first-or-sjf-cpu-scheduling-algorithm/' },
      { id: 'g-14', title: 'Find maximum sum possible equal sum of three stacks', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/equal-sum-in-three-stacks/1' },
      { id: 'g-15', title: 'Water Connection Problem', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/water-connection-problem/1' },
      { id: 'g-16', title: 'Find maximum meetings in one room', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1' },
      { id: 'g-17', title: 'Maximize sum of consecutive differences in a circular array', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/maximize-sum-of-consecutive-differences-in-a-circular-array/1' },
      { id: 'g-18', title: 'Minimum Cost of ropes', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1' },
      { id: 'g-19', title: 'Huffman Coding', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/huffman-encoding3345/1' },
      { id: 'g-20', title: 'Greedy Algorithm to find Minimum number of Coins', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/minimum-number-of-coins/' },
      { id: 'g-21', title: 'Program for Least Recently Used (LRU) Page Replacement algorithm', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/page-faults-in-lru/1' },
      { id: 'g-22', title: 'Activity Selection Problem', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1' },
      { id: 'g-23', title: 'Check if it is possible to survive on Island', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/survival-on-island/1' },
      { id: 'g-24', title: 'Maximize array sum after K negations', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/' },
      { id: 'g-25', title: 'Chocolate Distribution Problem', difficulty: 'Easy', url: 'https://www.geeksforgeeks.org/problems/chocolate-distribution-problem/1' },
      { id: 'g-26', title: 'ARRANGE - Arranging Amplifiers', difficulty: 'Medium', url: 'https://www.spoj.com/problems/ARRANGE/' },
      { id: 'g-27', title: 'Job Sequencing Problem', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1' },
      { id: 'g-28', title: 'Minimum Cost to cut a board into squares', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/minimum-cost-to-cut-a-board-into-squares/1' },
      { id: 'g-29', title: 'Maximum product subset of an array', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/maximum-product-subset-of-an-array/1' },
      { id: 'g-30', title: 'DEFKIN - Defense of a Kingdom', difficulty: 'Medium', url: 'https://www.spoj.com/problems/DEFKIN/' },
      { id: 'g-31', title: 'Find smallest number with given number of digits and sum of digits', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/find-smallest-number-with-given-number-of-digits-and-sum-of-digits/1' },
      { id: 'g-32', title: 'Fractional Knapsack Problem', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1' },
      { id: 'g-33', title: 'Maximum trains for which stoppage can be provided', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/maximum-trains-for-which-stoppage-can-be-provided/1' },
      { id: 'g-34', title: 'Smallest subset with sum greater than all other elements', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/smallest-subset-with-sum-greater-than-all-other-elements/1' },
      { id: 'g-35', title: 'K Centers Problem', difficulty: 'Hard', url: 'https://www.geeksforgeeks.org/problems/k-center-problem/1' }
    ]
  },
  {
    id: 'dsa-backtracking',
    title: 'BackTracking',
    description: 'Exploration, pruning, permutations, and constraint-based search.',
    questions: backtrackingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-stacks-queues',
    title: 'Stacks & Queues',
    description: 'Stack, queue, deque, and interval-processing problems.',
    questions: stacksQueuesProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-heap',
    title: 'Heap',
    description: 'Priority queues, heap construction, and scheduling problems.',
    questions: heapProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-graph',
    title: 'Graph',
    description: 'Connectivity, shortest path, and traversal problems.',
    questions: [
      { id: '301', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '302', title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: '303', title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '304', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' }
    ]
  },
  {
    id: 'dsa-dp',
    title: 'Dynamic Programming',
    description: 'Optimal substructure, memoization, tabulation, and classic DP patterns.',
    questions: dynamicProgrammingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-bit-manipulation',
    title: 'Bit Manipulation',
    description: 'Bit tricks, masks, set bits, and XOR-based interview questions.',
    questions: bitManipulationProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-strings',
    title: 'String',
    description: 'String manipulation, matching, character frequencies, and palindrome checks.',
    questions: stringProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  }
];


export const aptitudeTopics = [
  {
    id: 'apt-percentages',
    title: 'Percentages',
    description: 'Percentage increase/decrease and related shortcuts.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/percentage/'
  },
  {
    id: 'apt-profit-loss-discount',
    title: 'Profit & Loss / Discount',
    description: 'Profit, loss, cost/selling price and discount calculations.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/profit-and-loss/'
  },
  {
    id: 'apt-ratio-proportion-mixtures',
    title: 'Ratio & Proportion / Partnership / Mixtures',
    description: 'Ratio calculations, partnership profit sharing and mixture problems.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/ratio-and-proportion/'
  },
  {
    id: 'apt-averages-ages',
    title: 'Averages / Ages',
    description: 'Average computations and age-based word problems.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/average/'
  },
  {
    id: 'apt-interest',
    title: 'Simple & Compound Interest',
    description: 'Interest formulas, compounding, and related amortization basics.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/simple-interest/'
  },
  {
    id: 'apt-time-work-pipes',
    title: 'Time & Work / Pipes & Cisterns',
    description: 'Work-rate problems including pipes and cisterns variants.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/time-and-work/'
  },
  {
    id: 'apt-speed-distance',
    title: 'Speed, Time & Distance / Trains / Boats & Streams',
    description: 'Relative speed, trains, boats & streams and average speed problems.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/speed-time-and-distance/'
  },
  {
    id: 'apt-number-system',
    title: 'Number System (LCM, HCF, Divisibility, Remainders)',
    description: 'Prime factors, LCM/HCF, divisibility tests and remainder tricks.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/numbers/'
  },
  {
    id: 'apt-algebra',
    title: 'Algebra (Linear & Quadratic equations, Inequalities)',
    description: 'Equations, inequalities and sequence basics needed for aptitude.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/algebra/'
  },
  {
    id: 'apt-geometry-mensuration',
    title: 'Geometry & Mensuration (Area, Volume, Triangles, Circles)',
    description: 'Area, volume, triangle and circle formulae and mensuration techniques.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/area/'
  },
  {
    id: 'apt-permutation-combination',
    title: 'Permutation & Combination',
    description: 'Counting techniques, permutations, combinations and basic counting principles.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/permutation-and-combination/'
  },
  {
    id: 'apt-probability',
    title: 'Probability',
    description: 'Basic probability rules, independent events and conditional probability.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/probability/'
  }
];

export const reasoningTopics = [
  {
    id: 'reason-blood-1',
    title: 'Blood Relations',
    description: 'Family relation puzzles and generational mapping.',
    focus: ['Parent/child mapping', 'In-law relations', 'Multi-step relations'],
    examples: ['Find relation between two members'],
    tips: ['Work outward from known relations'],
  },
  {
    id: 'reason-direction-1',
    title: 'Direction Sense',
    description: 'Compass directions, left-right turns and grid mapping questions.',
    focus: ['Compass logic', 'Relative movement', 'Coordinate tracking'],
    examples: ['Final position after moves'],
    tips: ['Track displacement components separately'],
  },
  {
    id: 'reason-coding-1',
    title: 'Coding-Decoding',
    description: 'Character/number substitution, reversible codes and pattern extraction.',
    focus: ['Substitution rules', 'Position mapping', 'Reversible transforms'],
    examples: ['Decode encoded words'],
    tips: ['Look for consistent shifts or transpositions'],
  },
  {
    id: 'reason-syllogism-1',
    title: 'Syllogism',
    description: 'Deductive reasoning using categorical propositions and Venn mapping.',
    focus: ['All/Some/No', 'Conclusion testing', 'Venn representation'],
    examples: ['Derive valid conclusions from premises'],
    tips: ['Draw Venn diagrams for visualization'],
  },
  {
    id: 'reason-inequalities-1',
    title: 'Inequalities (Coded / Direct)',
    description: 'Order-based constraints presented directly or via coded statements.',
    focus: ['Pairwise comparisons', 'Coded inequalities', 'Transitive ordering'],
    examples: ['Establish element ordering'],
    tips: ['Build relation graphs to infer transitive links'],
  },
  {
    id: 'reason-venn-1',
    title: 'Logical Venn Diagrams',
    description: 'Set overlaps, exclusions and combined-condition reasoning using Venns.',
    focus: ['Set intersection', 'Exclusive regions', 'Counting overlaps'],
    examples: ['Count elements satisfying combined conditions'],
    tips: ['Label regions and apply inclusion–exclusion'],
  },
  {
    id: 'reason-seating-1',
    title: 'Seating Arrangement',
    description: 'Linear, circular and square seating problems with constraints.',
    focus: ['Position constraints', 'Left/right relations', 'Circular symmetry'],
    examples: ['Seating with adjacency constraints'],
    tips: ['Fix one position to remove rotational symmetry'],
  },
  {
    id: 'reason-puzzles-1',
    title: 'Puzzles (Floor, Box, Day-based)',
    description: 'Multi-constraint puzzles involving floors, boxes, days and attributes.',
    focus: ['Constraint propagation', 'Attribute assignment', 'Backtracking'],
    examples: ['Assign attributes satisfying all clues'],
    tips: ['Tabulate possibilities and eliminate progressively'],
  },
  {
    id: 'reason-data-suff-1',
    title: 'Data Sufficiency',
    description: 'Decide if given statements are sufficient to answer the question.',
    focus: ['Statement analysis', 'Minimal sufficiency', 'Elimination'],
    examples: ['Select sufficient statement combinations'],
    tips: ['Test statements independently and jointly'],
  },
  {
    id: 'reason-series-1',
    title: 'Series Completion',
    description: 'Numeric, alphanumeric and letter series with pattern detection.',
    focus: ['Difference patterns', 'Alphanumeric shifts', 'Matrix patterns'],
    examples: ['Find the missing term'],
    tips: ['Check multiple levels (first diff, second diff)'],
  },
  {
    id: 'reason-order-ranking-1',
    title: 'Order & Ranking',
    description: 'Problems on relative ranks, positions and ordering with ties.',
    focus: ['Rank calculations', 'Relative positions', 'Tie handling'],
    examples: ['Find position from end given ranks'],
    tips: ['Translate rank statements into numeric positions'],
  },
  {
    id: 'reason-clock-calendar-1',
    title: 'Clock & Calendar',
    description: 'Reasoning with clock angles and calendar date/day computations.',
    focus: ['Clock angles', 'Day of week', 'Leap year rules'],
    examples: ['Angle between hands', 'Day for a given date'],
    tips: ['Use modular arithmetic for weekdays'],
  }
];

export const verbalTopics = [
  {
    id: 'verb-grammar-1',
    title: 'Grammar & Usage',
    description: 'Parts of speech, subject-verb agreement, tenses, modifiers, prepositions and common error spotting.',
    focus: ['Subject-verb agreement', 'Tenses', 'Modifiers', 'Error spotting'],
    examples: ['Identify the wrong tense', 'Choose correct article', 'Fix modifier placement'],
    tips: ['Check subject-verb agreement first', 'Ensure article matches noun count'],
    formulas: []
  },
  {
    id: 'verb-vocab-1',
    title: 'Vocabulary & Word Usage',
    description: 'Synonyms, antonyms, word roots, prefixes/suffixes, collocations and contextual meanings.',
    focus: ['Roots', 'Collocations', 'Context words', 'Synonyms/antonyms'],
    examples: ['Prefix/suffix meaning', 'Word substitution', 'Context-based vocabulary'],
    tips: ['Identify root words to infer meaning', 'Use collocations for natural usage'],
    formulas: []
  },
  {
    id: 'verb-reading-1',
    title: 'Reading Comprehension',
    description: 'Passage reading, main idea identification, inference, tone, and question answering strategies.',
    focus: ['Main idea', 'Inference', 'Tone', 'Fact vs opinion'],
    examples: ['Short and long passages', 'Tone detection', 'Author intent questions'],
    tips: ['Skim for main idea before details', 'Notice tone markers like adjectives'],
    formulas: []
  },
  {
    id: 'verb-para-1',
    title: 'Para Jumbles & Sentence Completion',
    description: 'Paragraph ordering, sentence insertion, fill-in-the-blanks and coherence-based tasks.',
    focus: ['Paragraph order', 'Sentence insertion', 'Fill in the blanks', 'Coherence'],
    examples: ['Opening and closing sentence logic', 'Connector clues', 'Flow-based ordering'],
    tips: ['Identify logical connectors', 'Maintain paragraph coherence'],
    formulas: []
  },
  {
    id: 'verb-summary-1',
    title: 'Summary & Note Making',
    description: 'Short summary selection, note writing and compact representation of dense passages.',
    focus: ['Condense ideas', 'Key points', 'Elimination', 'Concise writing'],
    examples: ['Choose the best summary', 'Write a bullet note', 'Remove redundant phrases'],
    tips: ['Capture key ideas in concise sentences', 'Eliminate filler words'],
    formulas: []
  },
  {
    id: 'verb-idioms-1',
    title: 'Idioms, Phrases & Collocations',
    description: 'Common idioms, fixed expressions, phrasal verbs and collocations used in formal writing and interviews.',
    focus: ['Phrasal verbs', 'Common idioms', 'Collocations', 'Usage practice'],
    examples: ['Choose correct idiom', 'Replace with appropriate phrasal verb'],
    tips: ['Match idiom meaning to context', 'Use common phrasal verbs for fluency'],
    formulas: []
  },
  {
    id: 'verb-sentence-1',
    title: 'Sentence Correction & Error Spotting',
    description: 'Identify grammatical and idiomatic errors in sentences and apply concise corrections.',
    focus: ['Subject-verb agreement', 'Modifier placement', 'Article usage', 'Parallel structure'],
    examples: ['Fix tense mismatch', 'Correct misplaced modifier'],
    tips: ['Ensure verb tense matches time reference', 'Place modifiers next to the words they modify'],
    formulas: []
  },
  {
    id: 'verb-speech-1',
    title: 'Direct & Indirect Speech',
    description: 'Conversion between direct and indirect speech, tense backshifts, and reporting verbs.',
    focus: ['Backshifting rules', 'Reporting verbs', 'Pronoun adjustments', 'Time expression changes'],
    examples: ['Convert direct to indirect', 'Handle question forms in indirect speech'],
    tips: ['Shift tenses back one step', 'Adjust pronouns and time expressions'],
    formulas: []
  },
  {
    id: 'verb-voice-1',
    title: 'Active & Passive Voice',
    description: 'Transform sentences between active and passive voice and maintain correct agent/subject relationships.',
    focus: ['Agent omission', 'Tense preservation', 'Passive forms', 'Two-object verbs'],
    examples: ['Convert to passive preserving meaning', 'Choose appropriate passive structure'],
    tips: ['Identify the object to become subject', 'Maintain tense consistency'],
    formulas: []
  },
  {
    id: 'verb-cloze-1',
    title: 'Cloze Tests & Fill-in-the-blanks',
    description: 'Context-based gap filling, collocation checks and discourse-level coherence for blank-filling tasks.',
    focus: ['Context clues', 'Collocation fit', 'Discourse markers', 'Grammar fit'],
    examples: ['Choose correct preposition', 'Select best discourse connector'],
    tips: ['Use context clues to select prepositions', 'Link sentences with appropriate connectors'],
  }
];

/*
export const dsaTopics = [
  {
    id: 'dsa-arrays',
    title: 'Arrays',
    description: 'Core linear structures and frequency-based problem solving.',
    questions: arrayProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url === '#' ? 'https://leetcode.com/problemset/all/' : p.url
    }))
  },
  {
    id: 'dsa-matrix',
    title: 'Matrix',
    description: 'Row and column traversal, rotation, and matrix-based search problems.',
    questions: matrixProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-strings',
    title: 'String',
    description: 'String manipulation, matching, character frequencies, and palindrome checks.',
    questions: stringProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-searching-sorting',
    title: 'Searching & Sorting',
    description: 'Binary search, partitioning, merge-sort, and classic sorting problems.',
    questions: searchingSortingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-stacks-queues',
    title: 'Stacks & Queues',
    description: 'Stack, queue, deque, and interval-processing problems.',
    questions: stacksQueuesProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-linked-list',
    title: 'Linked List',
    description: 'Pointer handling, circular lists, reversal, sorting, and classic list operations.',
    questions: linkedListProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-binary-trees',
    title: 'Binary Trees',
    description: 'Traversal, views, LCA, tree construction, and subtree logic.',
    questions: binaryTreeProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-bst',
    title: 'Binary Search Trees',
    description: 'BST insertion, deletion, LCA, validation, and order-statistics problems.',
    questions: binarySearchTreeProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-stacks-queues',
    title: 'Stacks & Queues',
    description: 'Stack, queue, deque, and interval-processing problems.',
    questions: stacksQueuesProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-heap',
    title: 'Heap',
    description: 'Priority queues, heap construction, and scheduling problems.',
    questions: heapProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-graphs-dp',
    title: 'Graphs & DP',
    description: 'Connectivity, shortest path, and memoized optimization.',
    questions: [
      { id: '301', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '302', title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: '303', title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '304', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' }
    ]
  },
  {
    id: 'dsa-dp',
    title: 'Dynamic Programming',
    description: 'Optimal substructure, memoization, tabulation, and classic DP patterns.',
    questions: dynamicProgrammingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
    id: 'dsa-linked-list',
    title: 'Linked List',
    description: 'Pointer handling, circular lists, reversal, sorting, and classic list operations.',
    questions: linkedListProblems.map((p) => ({
    id: 'dsa-bit-manipulation',
    title: 'Bit Manipulation',
    description: 'Bit tricks, masks, set bits, and XOR-based interview questions.',
    questions: bitManipulationProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
    id: 'dsa-binary-trees',
    title: 'Binary Trees',
    description: 'Traversal, views, LCA, tree construction, and subtree logic.',
    questions: binaryTreeProblems.map((p) => ({
    id: 'dsa-linkedlist-stack',
    title: 'Linked List & Stack',
    description: 'Pointer manipulation and last-in-first-out workflows.',
    questions: [
      { id: '101', title: 'Reverse a Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '102', title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: '103', title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
    id: 'dsa-bst',
    title: 'Binary Search Trees',
    description: 'BST insertion, deletion, LCA, validation, and order-statistics problems.',
    questions: binarySearchTreeProblems.map((p) => ({
    id: 'dsa-trees-recursion',
    title: 'Trees & Recursion',
    description: 'Depth-first thinking, traversal patterns, and divide-and-conquer.',
    questions: [
      { id: '201', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: '202', title: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: '203', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    id: 'dsa-greedy',
    title: 'Greedy',
    description: 'Locally optimal choices, interval picking, and exchange arguments.',
    questions: []
  },
  {
    id: 'dsa-backtracking',
    title: 'BackTracking',
    description: 'Exploration, pruning, permutations, and constraint-based search.',
    questions: []
  },
  {
    id: 'dsa-stacks-queues',
    title: 'Stacks & Queues',
    description: 'Stack, queue, deque, and interval-processing problems.',
    questions: stacksQueuesProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-heap',
    title: 'Heap',
    description: 'Priority queues, heap construction, and scheduling problems.',
    questions: heapProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-graph',
    title: 'Graph',
    description: 'Connectivity, shortest path, and traversal problems.',
    questions: [
      { id: '301', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '302', title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: '303', title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '304', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' }
    ]
  },
  {
    id: 'dsa-dp',
    title: 'Dynamic Programming',
    description: 'Optimal substructure, memoization, tabulation, and classic DP patterns.',
    questions: dynamicProgrammingProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-bit-manipulation',
    title: 'Bit Manipulation',
    description: 'Bit tricks, masks, set bits, and XOR-based interview questions.',
    questions: bitManipulationProblems.map((p) => ({
      id: String(p.id),
      title: p.title,
      difficulty: p.difficulty,
      url: p.url
    }))
  },
  {
    id: 'dsa-trie',
    title: 'Trie',
    description: 'Prefix trees, word lookup, autocomplete, and string dictionary problems.',
    questions: []
*/
