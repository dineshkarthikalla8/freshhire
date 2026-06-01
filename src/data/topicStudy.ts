import type { StudyTopicKey, TopicSection } from '../types/study';

export const studyTopicTitles: Record<StudyTopicKey, string> = {
  dsa: 'DSA Prep',
  aptitude: 'Aptitude',
  reasoning: 'Reasoning',
  verbal: 'Verbal',
};

export const studyTopicIntro: Record<StudyTopicKey, string> = {
  dsa: 'Important algorithms, patterns, and problem-solving formulas for coding interviews.',
  aptitude: 'Core calculations, shortcuts, and exam-friendly tricks for fast problem solving.',
  reasoning: 'Logic patterns, arrangements, and deduction methods used in aptitude-style reasoning rounds.',
  verbal: 'Grammar, reading, vocabulary, and sentence logic with quick test-taking tips.',
};

export const studyTopicSections: Record<StudyTopicKey, TopicSection[]> = {
  dsa: [
    {
      title: 'Arrays',
      description: 'Core linear structures, elements positioning, and sum-based subarray operations.',
      focusAreas: ['Two pointers', 'Prefix sums', 'Sliding window', 'Kadane\'s algorithm'],
      samplePatterns: ['Subarray sum', 'Maximum subarray', 'Container with most water'],
      tips: ['Use two pointers for sorted arrays.', 'Keep a running sum for subarray evaluations.'],
      formulas: ['Prefix sum[i] = sum of first i values', 'Kadane\'s sum = max(arr[i], current_sum + arr[i])'],
    },
    {
      title: 'Strings',
      description: 'String parsing, character frequency counting, and matching patterns.',
      focusAreas: ['Hash maps', 'Sliding window', 'Two pointers', 'Frequency tracking'],
      samplePatterns: ['Valid anagram', 'Longest unique substring', 'Valid palindrome'],
      tips: ['Use integer arrays of size 26 for alphabet frequency storage.', 'Prefer sliding window for search of contiguous patterns.'],
      formulas: ['Character index = charCodeAt(i) - 97', 'Reverse string logic'],
    },
    {
      title: 'Stacks & Queues',
      description: 'Queue, stack, deque, and last-in-first-out workflows.',
      focusAreas: ['Reversal', 'Cycle detection', 'Monotonic stack', 'Parentheses'],
      samplePatterns: ['Reverse list', 'Next greater element', 'Balanced brackets'],
      tips: ['Draw node pointers before coding.', 'Use stack for matching and backtracking patterns.'],
      formulas: ['Reversal = prev, curr, next pointer chain'],
    },
    {
      title: 'Trees & Recursion',
      description: 'Depth-first thinking, traversal patterns, and divide-and-conquer.',
      focusAreas: ['Traversal', 'Height', 'BST', 'Backtracking'],
      samplePatterns: ['Inorder traversal', 'Lowest common ancestor', 'Path sum'],
      tips: ['Base case first.', 'Use recursion for naturally branching problems.'],
      formulas: ['Tree height = 1 + max(left, right)'],
    },
    {
      title: 'Graphs & DP',
      description: 'Connectivity, shortest path, and memoized optimization.',
      focusAreas: ['BFS/DFS', 'Shortest path', 'Topological sort', 'Memoization'],
      samplePatterns: ['Island counting', 'Shortest route', '0/1 knapsack'],
      tips: ['Track visited nodes carefully.', 'For DP, define state, transition, base case.'],
      formulas: ['DP state = answer for a subproblem'],
    },
  ],
  aptitude: [
    {
      title: 'Geometry Basics',
      description: 'Foundational area and shape formulas used in aptitude questions.',
      focusAreas: ['Area', 'Perimeter', 'Circles'],
      samplePatterns: ['Triangle area', 'Circle area'],
      tips: ['Base × height / 2 for triangles.', 'πr² for circles.'],
      formulas: []
    },
    {
      title: 'Average',
      description: 'Mean, weighted average and related calculations.',
      focusAreas: ['Arithmetic mean', 'Weighted average'],
      samplePatterns: ['Class average', 'Average speed'],
      tips: ['Sum values then divide by count.', 'For weighted, multiply by weights.'],
      formulas: ['Average = Σx / n']
    },
    {
      title: "Banker's Discount",
      description: 'Discount calculated on the future value (face value) of a bill.',
      focusAreas: ['Discount'],
      samplePatterns: ["Banker's discount calculation"],
      tips: ['Discount = (Face value × Rate × Time) / 100'],
      formulas: []
    },
    {
      title: 'Boats and Streams',
      description: 'Relative speed problems involving water current.',
      focusAreas: ['Relative speed', 'Upstream', 'Downstream'],
      samplePatterns: ['Boat speed in still water', 'Time to cross river'],
      tips: ['Downstream speed = boat + stream.', 'Upstream speed = boat − stream.'],
      formulas: []
    },
    {
      title: 'Calendar',
      description: 'Date calculations, finding day of week, leap years, etc.',
      focusAreas: ['Day calculation', 'Leap year'],
      samplePatterns: ['Find day of week for a given date'],
      tips: ['Use Zeller’s congruence or known reference dates.'],
      formulas: []
    },
    {
      title: 'Chain Rule',
      description: 'Differentiation of composite functions (for advanced aptitude).',
      focusAreas: ['Differentiation'],
      samplePatterns: ['dy/dx of (f(g(x)))'],
      tips: ['(f∘g)′ = f′(g(x))·g′(x)'],
      formulas: []
    },
    {
      title: 'Clock',
      description: 'Angle and time calculations involving analog clocks.',
      focusAreas: ['Clock angle'],
      samplePatterns: ['Angle between hour and minute hands'],
      tips: ['Hour hand moves 0.5° per minute.', 'Minute hand moves 6° per minute.'],
      formulas: []
    },
    {
      title: 'Commercial Maths & Logic',
      description: 'Profit & loss, discount, partnership, averages, ages, mixtures, and decision‑based aptitude.',
      focusAreas: ['Profit', 'Loss', 'Discount', 'Partnership', 'Ages', 'Mixtures', 'Logical reasoning'],
      samplePatterns: ['Business profit', 'Age difference'],
      tips: ['Use cost price as base for profit/loss.', 'Set up equations for partnership.'],
      formulas: []
    },
    {
      title: 'Compound Interest',
      description: 'Interest compounded over multiple periods.',
      focusAreas: ['Compound interest'],
      samplePatterns: ['Future value of investment'],
      tips: ['A = P (1 + r/n)^(nt)'],
      formulas: []
    },
    {
      title: 'Data Interpretation',
      description: 'Bar charts, line graphs, tables, pie charts and multi‑step comparison questions.',
      focusAreas: ['Charts', 'Graphs', 'Tables'],
      samplePatterns: ['Percentage increase', 'Average from data'],
      tips: ['Read the question carefully and convert units consistently.'],
      formulas: []
    },
    {
      title: 'Decimal Fraction',
      description: 'Operations with decimals and fractions, conversions and simplifications.',
      focusAreas: ['Decimal operations', 'Fraction operations'],
      samplePatterns: ['Add/subtract fractions', 'Convert decimal to fraction'],
      tips: ['Find common denominator for fractions.', 'Multiply numerator and denominator to eliminate decimal.'],
      formulas: []
    },
    {
      title: 'Geometry & Mensuration',
      description: 'Angles, triangles, circles, coordinate geometry, area, volume, Pythagoras, similarity and congruence.',
      focusAreas: ['Triangles', 'Circles', 'Area', 'Volume', 'Coordinate geometry'],
      samplePatterns: ['Find area of triangle', 'Distance between points'],
      tips: ['Use Pythagoras for right triangles.', 'Remember π≈3.14.'],
      formulas: []
    },
    {
      title: 'Height and Distance',
      description: 'Problems involving heights of towers, bridges, and distances in plane geometry.',
      focusAreas: ['Height', 'Distance'],
      samplePatterns: ['Angle of elevation/depression'],
      tips: ['Use tanθ = opposite/adjacent.', 'Convert angles to radians if needed.'],
      formulas: []
    },
    {
      title: 'Linear Programming & Optimization',
      description: 'Feasible regions, objective functions, simple LP setups and intuitive optimization on inequalities.',
      focusAreas: ['Feasible region', 'Objective function', 'Constraints'],
      samplePatterns: ['Maximize profit', 'Minimize cost'],
      tips: ['Plot constraints to find intersection points.', 'Evaluate objective function at corner points.'],
      formulas: []
    },
    {
      title: 'Logarithm',
      description: 'Properties and applications of logarithms.',
      focusAreas: ['Log rules'],
      samplePatterns: ['Simplify log expressions'],
      tips: ['log_a(bc) = log_a b + log_a c', 'log_a(b^n) = n·log_a b'],
      formulas: []
    },
    {
      title: 'Matrices, Determinants & Linear Algebra basics',
      description: 'Basic matrix operations, determinants, solving small linear systems using matrix intuition and Cramer’s rule.',
      focusAreas: ['Matrix multiplication', 'Determinant', 'Cramer’s rule'],
      samplePatterns: ['Solve 2×2 system'],
      tips: ['Determinant ≠ 0 for unique solution.', 'Use row reduction for larger systems.'],
      formulas: []
    },
    {
      title: 'Number Systems & Basic Arithmetic',
      description: 'Integers, LCM/GCD, divisibility, remainders, modular arithmetic, percentages, ratios and simple & compound interest.',
      focusAreas: ['Divisibility', 'Remainders', 'Modular arithmetic', 'Percentages', 'Ratios'],
      samplePatterns: ['Find HCF/LCM', 'Compute remainder'],
      tips: ['Prime factorisation helps for HCF/LCM.', 'Use Euclidean algorithm for GCD.'],
      formulas: []
    },
    {
      title: 'Number Theory & Modular Arithmetic',
      description: 'Prime factors, modular residues, Chinese remainder theorem basics and simple congruences.',
      focusAreas: ['Prime factorisation', 'Modular cycles', 'CRT'],
      samplePatterns: ['Find modular inverse'],
      tips: ['Reduce numbers modulo n early.', 'Look for patterns in residues.'],
      formulas: []
    },
    {
      title: 'Numbers',
      description: 'General number properties and manipulations.',
      focusAreas: ['Properties'],
      samplePatterns: [],
      tips: [],
      formulas: []
    },
    {
      title: 'Partnership',
      description: 'Profit sharing and investment partnership problems.',
      focusAreas: ['Profit sharing'],
      samplePatterns: ['Divide profit based on investment ratio'],
      tips: ['Set up ratio of investments to profit.'],
      formulas: []
    },
    {
      title: 'Percentage',
      description: 'Basic percentage calculations and applications.',
      focusAreas: ['Percentage'],
      samplePatterns: ['Calculate percentage increase'],
      tips: ['% = (part/whole)×100'],
      formulas: []
    },
    {
      title: 'Permutation and Combination',
      description: 'Counting principles for arrangements and selections.',
      focusAreas: ['Permutation', 'Combination'],
      samplePatterns: ['Arrange books', 'Select committee'],
      tips: ['Use nPr and nCr formulas.', 'Order matters for permutations.'],
      formulas: []
    },
    {
      title: 'Pipes and Cistern',
      description: 'Filling and emptying problems with pipes and tanks.',
      focusAreas: ['Rate problems'],
      samplePatterns: ['Time to fill cistern'],
      tips: ['Combine rates: 1/T_total = Σ 1/T_i'],
      formulas: []
    },
    {
      title: 'Probability',
      description: 'Basic probability rules and combinatorial probability.',
      focusAreas: ['Probability'],
      samplePatterns: ['Dice roll outcomes'],
      tips: ['P = favorable/total.', 'Use complementary events.'],
      formulas: []
    },
    {
      title: 'Probability & Combinatorics',
      description: 'Permutations, combinations and probability together.',
      focusAreas: ['Counting', 'Probability'],
      samplePatterns: ['Expected value calculations'],
      tips: ['Multiply probability by number of favorable cases.'],
      formulas: []
    },
    {
      title: 'Problems on Ages',
      description: 'Age difference and sum problems.',
      focusAreas: ['Age'],
      samplePatterns: ['Find current ages given past/future differences'],
      tips: ['Set up equations based on given differences.'],
      formulas: []
    },
    {
      title: 'Problems on H.C.F and L.C.M',
      description: 'Finding HCF and LCM in various contexts.',
      focusAreas: ['HCF', 'LCM'],
      samplePatterns: ['Find HCF of numbers'],
      tips: ['Use prime factorisation or Euclidean algorithm.'],
      formulas: []
    },
    {
      title: 'Problems on Numbers',
      description: 'Number manipulation, digit based problems.',
      focusAreas: ['Digit operations'],
      samplePatterns: ['Find sum of digits'],
      tips: ['Break number into place values.'],
      formulas: []
    },
    {
      title: 'Problems on Trains',
      description: 'Relative speed, crossing, and meeting point problems involving trains.',
      focusAreas: ['Relative speed'],
      samplePatterns: ['Two trains approaching each other'],
      tips: ['Use distance = speed × time for each train.'],
      formulas: []
    },
    {
      title: 'Profit and Loss',
      description: 'Business profit and loss calculations.',
      focusAreas: ['Profit', 'Loss'],
      samplePatterns: ['Marked price discount'],
      tips: ['Use cost price as base for profit/loss.'],
      formulas: []
    },
    {
      title: 'Races and Games',
      description: 'Race and game based timing problems.',
      focusAreas: ['Relative speed'],
      samplePatterns: ['Two runners starting together'],
      tips: ['Find time when one overtakes another.'],
      formulas: []
    },
    {
      title: 'Ratio and Proportion',
      description: 'Direct and inverse proportion problems.',
      focusAreas: ['Ratio', 'Proportion'],
      samplePatterns: ['Split amount in given ratio'],
      tips: ['Cross‑multiply to solve proportions.'],
      formulas: []
    },
    {
      title: 'Simple Interest',
      description: 'Interest calculated on the original principal.',
      focusAreas: ['Simple interest'],
      samplePatterns: ['Calculate SI for given P,R,T'],
      tips: ['SI = (P×R×T)/100'],
      formulas: []
    },
    {
      title: 'Simplification',
      description: 'Simplifying algebraic expressions and radicals.',
      focusAreas: ['Algebraic simplification'],
      samplePatterns: ['Simplify rational expressions'],
      tips: ['Factor numerator and denominator first.'],
      formulas: []
    },
    {
      title: 'Speed, Distance & Time',
      description: 'Classic motion problems involving speed, distance and time.',
      focusAreas: ['Speed', 'Distance', 'Time'],
      samplePatterns: ['Train problems', 'Relative speed'],
      tips: ['Distance = speed × time.', 'Relative speed = sum/difference of speeds.'],
      formulas: []
    },
    {
      title: 'Square Root and Cube Root',
      description: 'Extraction and manipulation of square and cube roots.',
      focusAreas: ['Roots'],
      samplePatterns: ['Find √(number)'],
      tips: ['Use prime factorisation for exact roots.'],
      formulas: []
    },
    {
      title: 'Statistics & Data Measures',
      description: 'Mean, median, mode, range, variance, standard deviation and interpretation of small datasets.',
      focusAreas: ['Measures of central tendency', 'Dispersion'],
      samplePatterns: ['Calculate mean and standard deviation'],
      tips: ['SD = √(variance).'],
      formulas: []
    },
    {
      title: 'Stocks and Shares',
      description: 'Basic stock market calculations like profit, loss and percentage change.',
      focusAreas: ['Stock profit'],
      samplePatterns: ['Calculate gain/loss on share price'],
      tips: ['Use percentage change formula.'],
      formulas: []
    },
    {
      title: 'Surds and Indices',
      description: 'Operations with irrational numbers and powers.',
      focusAreas: ['Surds', 'Indices'],
      samplePatterns: ['Simplify √(a) × √(b)'],
      tips: ['Convert to same base before operating.'],
      formulas: []
    },
    {
      title: 'Time and Distance',
      description: 'Basic distance‑time‑speed problems.',
      focusAreas: ['Speed', 'Distance', 'Time'],
      samplePatterns: ['Calculate time for a journey'],
      tips: ['Speed = distance / time.'],
      formulas: []
    },
    {
      title: 'Time and Work',
      description: 'Work‑rate problems involving multiple agents.',
      focusAreas: ['Work rate'],
      samplePatterns: ['Two people together completing a task'],
      tips: ['Add individual rates.'],
      formulas: []
    },
    {
      title: 'True Discount',
      description: 'Discount calculated on the present value rather than the marked price.',
      focusAreas: ['Discount'],
      samplePatterns: ['Find true discount given rate and time'],
      tips: ['True discount = (Face value × Rate × Time) / (100 + Rate × Time)'],
      formulas: []
    },
    {
      title: 'Percentages & Ratio',
      description: 'Conversion between percentages, ratios, and proportions.',
      focusAreas: ['Percentage', 'Ratio', 'Proportion'],
      samplePatterns: ['Successive percentages', 'Ratio splits', 'Part to whole'],
      tips: ['Convert percentages to fractions.', 'Maintain base values.'],
      formulas: ['% = (part/whole)*100', 'a:b = a/b'],
    },
    {
      title: 'Profit, Loss & Discount',
      description: 'Business calculations for profit, loss, and discounts.',
      focusAreas: ['Profit', 'Loss', 'Discount'],
      samplePatterns: ['Marked price discount', 'Profit percentage'],
      tips: ['Use cost price as base.', 'Apply successive discounts carefully.'],
      formulas: ['Profit% = (Profit/CP)*100', 'Discount% = (Discount/MP)*100'],
    },
    {
      title: 'Averages',
      description: 'Mean, weighted average and related calculations.',
      focusAreas: ['Average', 'Weighted average'],
      samplePatterns: ['Class average', 'Average speed'],
      tips: ['Sum values then divide by count.', 'For weighted, multiply by weights.'],
      formulas: ['Average = Σx / n'],
    },
    {
      title: 'Time & Work',
      description: 'Work-rate problems involving multiple workers.',
      focusAreas: ['Work rate', 'Combined work'],
      samplePatterns: ['Two people together', 'Time to complete task'],
      tips: ['Add rates, not times.', 'Convert to common units.'],
      formulas: ['Work rate = 1/time', 'Combined rate = sum of individual rates'],
    },
    {
      title: 'Time, Speed & Distance',
      description: 'Relationships between time, speed and distance.',
      focusAreas: ['Speed', 'Distance', 'Time'],
      samplePatterns: ['Train problems', 'Relative speed'],
      tips: ['Distance = speed × time.', 'For relative speed, subtract or add velocities.'],
      formulas: ['Speed = Distance/Time'],
    },
    {
      title: 'Number System',
      description: 'Properties of numbers, divisibility, HCF, LCM, remainders.',
      focusAreas: ['Divisibility', 'HCF', 'LCM', 'Remainders'],
      samplePatterns: ['Find HCF/LCM', 'Remainder problems'],
      tips: ['Prime factorization helps.', 'Use Euclidean algorithm for HCF.'],
      formulas: ['HCF × LCM = a × b'],
    },
    {
      title: 'Data Interpretation (DI)',
      description: 'Analyzing data presented in tables, charts, and graphs.',
      focusAreas: ['Tables', 'Charts', 'Graphs'],
      samplePatterns: ['Percentage increase', 'Average calculations from data'],
      tips: ['Read questions carefully.', 'Convert units consistently.'],
      formulas: [],
    },
    {
      title: 'Simple & Compound Interest',
      description: 'Interest calculations for principal over time.',
      focusAreas: ['Simple interest', 'Compound interest'],
      samplePatterns: ['Loan interest', 'Growth over years'],
      tips: ['SI = P×R×T/100', 'CI uses formula A = P(1 + r/n)^(nt).'],
      formulas: ['Simple Interest = (P×R×T)/100', 'Compound Interest = P[(1 + r/n)^(nt) - 1]'],
    },
    {
      title: 'Probability',
      description: 'Chance of events and outcomes.',
      focusAreas: ['Basic probability', 'Conditional probability'],
      samplePatterns: ['Dice rolls', 'Selecting items'],
      tips: ['Probability = favorable/total.', 'Use complementary events.'],
      formulas: ['P(A) = n(A)/n(S)'],
    },
    {
      title: 'Permutation & Combination',
      description: 'Counting arrangements and selections.',
      focusAreas: ['Permutation', 'Combination'],
      samplePatterns: ['Arrange books', 'Select committee'],
      tips: ['Use nPr and nCr formulas.', 'Distinguish when order matters.'],
      formulas: ['nPr = n!/(n-r)!', 'nCr = n!/[r!(n-r)!]'],
    },
    {
      title: 'Mixtures & Allegations',
      description: 'Problems involving mixing solutions of different concentrations.',
      focusAreas: ['Mixture', 'Alligation'],
      samplePatterns: ['Mixing solutions', 'Alligation method'],
      tips: ['Use weighted average.', 'Keep track of total quantity.'],
      formulas: [],
    },
  ],
  reasoning: [
    {
      title: 'Logical Reasoning',
      description: 'Syllogisms, truth tables, propositions, logical deductions, Venn diagrams and set reasoning.',
      focusAreas: ['Syllogisms', 'Venn diagrams', 'Inference rules', 'Truth tables'],
      samplePatterns: ['All/Some/No statements', 'Negation based elimination', 'Set overlap questions'],
      tips: ['Draw Venn diagrams to visualize set relations', 'Apply De Morgan’s laws for negations'],
      formulas: ['De Morgan: ¬(A∧B)=¬A∨¬B', 'Implication: A→B = ¬A∨B'],
    },
    {
      title: 'Puzzles & Arrangement',
      description: 'Seating arrangements, scheduling, ordering, binary puzzles and constraint satisfaction techniques.',
      focusAreas: ['Seating', 'Scheduling', 'Ordering', 'Constraint solving'],
      samplePatterns: ['Linear arrangement puzzle', 'Circular seating', 'Slot-based scheduling'],
      tips: ['Use graph representations for seating constraints', 'Apply backtracking for arrangement enumeration'],
      formulas: ['Permutation count: n! for distinct arrangements'],
    },
    {
      title: 'Pattern & Series',
      description: 'Number and letter series, matrix patterns, sequence completion and pattern recognition strategies.',
      focusAreas: ['Numeric series', 'Alphabet series', 'Matrix patterns', 'Sequence completion'],
      samplePatterns: ['Difference patterns', 'Alternating operations', 'Missing term logic'],
      tips: ['Identify common differences or ratios', 'Check for alternating sequences'],
      formulas: ['Arithmetic difference: a_n = a_1 + (n-1)d', 'Geometric ratio: a_n = a_1 * r^{n-1}'],
    },
    {
      title: 'Analogies & Classification',
      description: 'Word analogies, odd-one-out, classification, category mapping and relationship identification.',
      focusAreas: ['Analogies', 'Odd one out', 'Classification', 'Relationship mapping'],
      samplePatterns: ['Word pair relations', 'Category grouping', 'Image or shape classification'],
      tips: ['Map analogies to relational templates (A:B :: C:D)', 'Group items by shared attributes'],
      formulas: ['Analogy structure: A is to B as C is to D'],
    },
    {
      title: 'Blood Relations & Family Trees',
      description: 'Family relation puzzles, symbolic representation of relationships and generational mapping.',
      focusAreas: ['Parent/child mapping', 'In-law relations', 'Gender neutral logic', 'Relation inference'],
      samplePatterns: ['Find relation between two members', 'Multi-step family mapping'],
      tips: ['Start from the known relation and work outward', 'Use generational hierarchy diagrams'],
      formulas: ['Static lesson + practice notes'],
    },
    {
      title: 'Coding-Decoding & Symbol Series',
      description: 'Character or number substitution rules, code pattern extraction, and reversible transforms.',
      focusAreas: ['Substitution rules', 'Reversible codes', 'Position-based mapping', 'Symbol arithmetic'],
      samplePatterns: ['Find original word from code', 'Apply shift-based coding'],
      tips: ['Look for consistent character shifts', 'Consider substitution ciphers like Caesar'],
      formulas: ['Static lesson + practice notes'],
    },
    {
      title: 'Input-Output & Machine Logic',
      description: 'Sequential transformation steps applied to strings or numbers; track the pipeline to deduce rules.',
      focusAreas: ['Stepwise transforms', 'Pattern deduction', 'Reverse engineering steps', 'Index mapping'],
      samplePatterns: ['Series of operations on numbers', 'String transformation pipelines'],
      tips: ['Trace each operation stepwise', 'Maintain a mapping of input to output'],
      formulas: ['Static lesson + practice notes'],
    },
    {
      title: 'Directions, Distances & Mapping',
      description: 'Compass directions, left-right turns, shortest path reasoning and grid-based mapping.',
      focusAreas: ['Compass logic', 'Relative movement', 'Coordinate tracking', 'Shortest path reasoning'],
      samplePatterns: ['Find final position after moves', 'Minimum steps on grid'],
      tips: ['Use vector addition for direction steps', 'Apply Manhattan distance for grid moves'],
      formulas: ['Distance = |Δx| + |Δy|'],
    },
    {
      title: 'Data Sufficiency & Decision Questions',
      description: 'Evaluate whether provided statements are sufficient to answer a question.',
      focusAreas: ['Statement analysis', 'Sufficiency rules', 'Elimination strategy', 'Practice classification'],
      samplePatterns: ['Determine sufficiency combinations', 'Minimal statement identification'],
      tips: ['Identify the minimal set of statements needed', 'Apply logical deduction to eliminate excess'],
      formulas: ['Static lesson + practice notes'],
    },
  ],
  verbal: [
    {
      title: 'Reading Comprehension',
      description: 'Passage-based inference, main idea, tone, and detail questions.',
      focusAreas: ['Main idea', 'Inference', 'Tone', 'Detail scanning'],
      samplePatterns: ['Author intent', 'Support evidence', 'Question mapping'],
      tips: ['Read the question before the passage if you need speed.', 'Go back to evidence instead of guessing.'],
      formulas: ['RC = main idea before details'],
    },
    {
      title: 'Grammar & Sentence Correction',
      description: 'Subject-verb agreement, tenses, modifiers, and parallelism.',
      focusAreas: ['Agreement', 'Tense', 'Modifier placement', 'Parallel structure'],
      samplePatterns: ['Error spotting', 'Sentence improvement', 'Fill-in-the-blank'],
      tips: ['Check the verb closest to the subject.', 'Remove awkward or incomplete phrases first.'],
      formulas: ['Subject-verb agreement first'],
    },
    {
      title: 'Vocabulary & Synonyms',
      description: 'Word meaning, context clues, and antonym/synonym logic.',
      focusAreas: ['Root words', 'Context clues', 'Synonyms', 'Antonyms'],
      samplePatterns: ['Odd word out', 'Closest meaning', 'Word replacement'],
      tips: ['Use the sentence context, not just memorized meaning.', 'Look for root and prefix hints.'],
      formulas: ['Vocabulary = root words + context'],
    },
    {
      title: 'Para Jumbles & Cloze Tests',
      description: 'Sentence ordering and contextual completion.',
      focusAreas: ['Flow', 'Connectors', 'Logic order', 'Grammar fit'],
      samplePatterns: ['Sentence sequencing', 'Blank fill', 'Paragraph completion'],
      tips: ['Look for connectors like however, therefore, and because.', 'Identify opening and concluding sentences first.'],
      formulas: ['Sequence = logic flow + connectors'],
    },
  ],
};