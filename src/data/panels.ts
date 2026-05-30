import arrayProblems from './dsa/array';

export const aptitudeTopics = [
  {
    id: 'apt-quant-1',
    title: 'Number Systems & Basic Arithmetic',
    description: 'Integers, LCM/GCD, divisibility, remainders, modular arithmetic, percentages, ratios and simple & compound interest.',
    focus: ['Divisibility rules', 'Remainder tricks', 'Percent change', 'Mixtures and ratios'],
    examples: ['LCM/GCD based shortcuts', 'Repeated percentage growth', 'Remainders in cyclic patterns'],
    tips: ['Always simplify fractions before applying LCM/GCD', 'Convert percentages to decimals for quick multiplication', 'Use modular arithmetic for cyclic remainder problems'],
    formulas: ['LCM(a,b) = (a*b)/GCD(a,b)', 'Percent = (part/whole)*100', 'Simple interest = P * R * T / 100']
  },
  {
    id: 'apt-algebra-1',
    title: 'Algebra & Equations',
    description: 'Linear equations, quadratic equations, inequalities, sequences and series, exponentials, logarithms and problem solving.',
    focus: ['Linear systems', 'Quadratic roots', 'Inequality signs', 'Series and progression'],
    examples: ['Factorize before solving', 'Use substitution for two equations', 'Spot common sequence patterns'],
    tips: ['Check for common factors before factoring quadratics', 'Use the discriminant to quickly assess root types', 'Rewrite inequalities to isolate variables'],
    formulas: ['Quadratic formula: x = (-b ± √(b²-4ac))/(2a)', 'Geometric series sum: S = a₁(1-rⁿ)/(1-r)', 'Log rule: log_b(MN)=log_bM+log_bN']
  },
  {
    id: 'apt-prob-1',
    title: 'Probability & Combinatorics',
    description: 'Permutations & combinations, probability rules, expected value, counting principles, basic combinatorial reasoning.',
    focus: ['Counting principles', 'Permutation vs combination', 'Conditional probability', 'Expected value'],
    examples: ['Ordered selections', 'Independent events', 'Sample space construction'],
    tips: ['Use nPr for ordered selections, nCr for unordered', 'Remember P(A∩B)=P(A)P(B|A)', 'Expected value = Σ (outcome × probability)'],
    formulas: ['Permutation: P(n,k)=n!/(n-k)!', 'Combination: C(n,k)=n!/(k!(n-k)!)', 'Bayes theorem: P(A|B)=P(B|A)P(A)/P(B)']
  },
  {
    id: 'apt-geometry-1',
    title: 'Geometry & Mensuration',
    description: 'Angles, triangles, circles, coordinate geometry, area, volume, Pythagoras, similarity and congruence.',
    focus: ['Triangles', 'Circles', 'Area and volume', 'Coordinate geometry'],
    examples: ['Angle chasing', 'Similarity ratios', 'Distance formula questions'],
    tips: ['Draw auxiliary lines to reveal hidden angles', 'Use coordinate formulas for distance and midpoint', 'Recall area formulas for common shapes'],
    formulas: ['Area of triangle = ½*b*h', 'Circle area = πr²', 'Distance formula: √((x₂-x₁)²+(y₂-y₁)²)']
  },
  {
    id: 'apt-speed-1',
    title: 'Speed, Distance & Time',
    description: 'Relative speed, average speed, boats & streams, trains, time-distance problems, work and time.',
    focus: ['Relative speed', 'Average speed', 'Boats and streams', 'Work and time'],
    examples: ['Meeting point problems', 'Train crossing formulas', 'Combined work rates'],
    tips: ['Convert all speeds to the same unit before calculations', 'Use relative speed for opposing/ same direction problems', 'Remember work = rate × time'],
    formulas: ['Distance = Speed × Time', 'Relative speed (same direction) = |v₁ - v₂|', 'Work rate = 1/time']
  },
  {
    id: 'apt-data-1',
    title: 'Data Interpretation',
    description: 'Bar charts, line graphs, tables, pie charts and multi-step comparison questions.',
    focus: ['Chart reading', 'Percentage comparison', 'Trend analysis', 'Approximation'],
    examples: ['Tables with multiple categories', 'Mixed graph sets', 'Fast approximation drills'],
    tips: ['Estimate totals before precise calculations', 'Look for patterns in successive data points', 'Convert ratios to percentages for easier comparison'],
    formulas: ['Percentage change = (New - Old)/Old × 100', 'Average = Σ values / n', 'Linear interpolation formula']
  },
  {
    id: 'apt-logic-1',
    title: 'Commercial Maths & Logic',
    description: 'Profit and loss, discount, partnership, averages, ages, mixtures, and decision-based aptitude.',
    focus: ['Profit/loss', 'Averages', 'Ages', 'Mixture and allegation'],
    examples: ['Marked price and discount', 'Weighted averages', 'Age progression style questions'],
    tips: ['Always convert percentages to decimals', 'Use weighted average formula when multiple groups are involved', 'Set up simple equations for mixture problems'],
    formulas: ['Profit = Selling Price - Cost Price', 'Discounted price = MRP × (1 - discount%)', 'Weighted average = Σ (value × weight) / Σ weight']
  },
  {
    id: 'apt-numbertheory-1',
    title: 'Number Theory & Modular Arithmetic',
    description: 'Prime factors, divisibility, modular residues, remainder cycles, Chinese remainder ideas and basic congruences.',
    focus: ['Prime factorization', 'Modular cycles', 'Remainder patterns', 'Congruences'],
    examples: ['Remainders after large powers', 'CRT style alignment', 'Divisor counting'],
    tips: ['Use prime factorization to simplify GCD/LCD', 'Identify cycles in modular exponentiation', 'Apply CRT when multiple moduli are coprime'],
    formulas: ['Euler’s totient φ(n)=n∏(1-1/p)', 'Modular exponentiation: a^b mod m', 'Chinese Remainder Theorem for solving simultaneous congruences']
  },
  {
    id: 'apt-statistics-1',
    title: 'Statistics & Data Measures',
    description: 'Mean, median, mode, range, variance, standard deviation, and interpretation of small datasets.',
    focus: ['Mean/median/mode', 'Range/SD', 'Weighted averages', 'Data cleaning basics'],
    examples: ['Change in mean after replacement', 'Weighted mean puzzles', 'Quick SD estimation'],
    tips: ['Use shortcut formulas for variance', 'Remember median is the middle value after sorting', 'Weighted mean helps when items have different importance'],
    formulas: ['Mean = Σ x / n', 'Variance = Σ (x-μ)² / n', 'Standard deviation = √variance']
  },
  {
    id: 'apt-matrices-1',
    title: 'Matrices, Determinants & Linear Algebra basics',
    description: 'Basic matrix operations, determinants, solving small linear systems using matrix intuition and Cramer’s rule glimpses.',
    focus: ['Matrix multiplication', 'Determinants', 'Linear systems', 'Cramer rule basics'],
    examples: ['2x2 determinant tricks', 'Solve 2 equations with 2 unknowns using determinants'],
    tips: ['For 2x2 determinant, use ad-bc shortcut', 'Check if determinant is zero before using Cramer', 'Remember transpose swaps rows and columns'],
    formulas: ['Determinant of 2x2 = a*d - b*c', "Cramer’s rule: x_i = det(A_i)/det(A)", 'Matrix multiplication rule: (AB)_ij = Σ_k A_ik B_kj']
  },
  {
    id: 'apt-optimization-1',
    title: 'Linear Programming & Optimization',
    description: 'Feasible regions, objective functions, simple LP setups and intuitive optimization on inequalities.',
    focus: ['Feasible region', 'Graphical LP', 'Constraint handling', 'Objective evaluation'],
    examples: ['Maximize under two constraints', 'Corner point checking'],
    tips: ['Plot constraints to visualize feasible region', 'Evaluate objective at all corner points', 'Check for redundancy in constraints'],
    formulas: ['Objective function: Z = c₁x₁ + c₂x₂', 'Constraint: a₁x₁ + a₂x₂ ≤ b', 'Optimal solution occurs at a vertex of feasible region']
  }
  ,
  // IndiaBix style granular topics
  {
    id: 'apt-trains',
    title: 'Problems on Trains',
    description: 'Train crossing, relative speed and meeting point questions.',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/problems-on-trains/'
  },
  {
    id: 'apt-time-distance',
    title: 'Time and Distance',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/time-and-distance/'
  },
  {
    id: 'apt-height-distance',
    title: 'Height and Distance',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/height-and-distance/'
  },
  {
    id: 'apt-time-work',
    title: 'Time and Work',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/time-and-work/'
  },
  {
    id: 'apt-simple-interest',
    title: 'Simple Interest',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/simple-interest/'
  },
  {
    id: 'apt-compound-interest',
    title: 'Compound Interest',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/compound-interest/'
  },
  {
    id: 'apt-profit-loss',
    title: 'Profit and Loss',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/profit-and-loss/'
  },
  {
    id: 'apt-partnership',
    title: 'Partnership',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/partnership/'
  },
  {
    id: 'apt-percentage',
    title: 'Percentage',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/percentage/'
  },
  {
    id: 'apt-ages',
    title: 'Problems on Ages',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/problems-on-ages/'
  },
  {
    id: 'apt-calendar',
    title: 'Calendar',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/calendar/'
  },
  {
    id: 'apt-clock',
    title: 'Clock',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/clock/'
  },
  {
    id: 'apt-average',
    title: 'Average',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/average/'
  },
  {
    id: 'apt-area',
    title: 'Area',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/area/'
  },
  {
    id: 'apt-volume-surface',
    title: 'Volume and Surface Area',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/volume-and-surface-area/'
  },
  {
    id: 'apt-perm-comb',
    title: 'Permutation and Combination',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/permutation-and-combination/'
  },
  {
    id: 'apt-numbers',
    title: 'Numbers',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/numbers/'
  },
  {
    id: 'apt-problems-on-numbers',
    title: 'Problems on Numbers',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/problems-on-numbers/'
  },
  {
    id: 'apt-hcf-lcm',
    title: 'Problems on H.C.F and L.C.M',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/problems-on-hcf-and-lcm/'
  },
  {
    id: 'apt-decimal-fraction',
    title: 'Decimal Fraction',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/decimal-fraction/'
  },
  {
    id: 'apt-simplification',
    title: 'Simplification',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/simplification/'
  },
  {
    id: 'apt-root',
    title: 'Square Root and Cube Root',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/square-root-and-cube-root/'
  },
  {
    id: 'apt-surds-indices',
    title: 'Surds and Indices',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/surds-and-indices/'
  },
  {
    id: 'apt-ratio-proportion',
    title: 'Ratio and Proportion',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/ratio-and-proportion/'
  },
  {
    id: 'apt-chain-rule',
    title: 'Chain Rule',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/chain-rule/'
  },
  {
    id: 'apt-pipes-cistern',
    title: 'Pipes and Cistern',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/pipes-and-cistern/'
  },
  {
    id: 'apt-boats-streams',
    title: 'Boats and Streams',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/boats-and-streams/'
  },
  {
    id: 'apt-alligation-mixture',
    title: 'Alligation or Mixture',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/alligation-or-mixture/'
  },
  {
    id: 'apt-logarithm',
    title: 'Logarithm',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/logarithm/'
  },
  {
    id: 'apt-races-games',
    title: 'Races and Games',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/races-and-games/'
  },
  {
    id: 'apt-stocks-shares',
    title: 'Stocks and Shares',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/stocks-and-shares/'
  },
  {
    id: 'apt-probability',
    title: 'Probability',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/probability/'
  },
  {
    id: 'apt-true-discount',
    title: 'True Discount',
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/true-discount/'
  },
  {
    id: 'apt-bankers-discount',
    title: "Banker's Discount",
    description: '',
    focus: [],
    examples: [],
    tips: [],
    formulas: [],
    source: 'https://www.indiabix.com/aptitude/bankers-discount/'
  }
];

export const reasoningTopics = [
  {
    id: 'reason-logical-1',
    title: 'Logical Reasoning',
    description: 'Syllogisms, truth tables, propositions, logical deductions, Venn diagrams and set reasoning.',
    focus: ['Syllogisms', 'Venn diagrams', 'Inference rules', 'Truth tables'],
    examples: ['All/Some/No statements', 'Negation based elimination', 'Set overlap questions'],
    tips: ['Draw Venn diagrams to visualize set relations', 'Apply De Morgan’s laws for negations'],
    formulas: ['De Morgan: ¬(A∧B)=¬A∨¬B', 'Implication: A→B = ¬A∨B']
  },
  {
    id: 'reason-puzzle-1',
    title: 'Puzzles & Arrangement',
    description: 'Seating arrangements, scheduling, ordering, binary puzzles and constraint satisfaction techniques.',
    focus: ['Seating', 'Scheduling', 'Ordering', 'Constraint solving'],
    examples: ['Linear arrangement puzzle', 'Circular seating', 'Slot-based scheduling'],
    tips: ['Use graph representations for seating constraints', 'Apply backtracking for arrangement enumeration'],
    formulas: ['Permutation count: n! for distinct arrangements']
  },
  {
    id: 'reason-pattern-1',
    title: 'Pattern & Series',
    description: 'Number and letter series, matrix patterns, sequence completion and pattern recognition strategies.',
    focus: ['Numeric series', 'Alphabet series', 'Matrix patterns', 'Sequence completion'],
    examples: ['Difference patterns', 'Alternating operations', 'Missing term logic'],
    tips: ['Identify common differences or ratios', 'Check for alternating sequences'],
    formulas: ['Arithmetic difference: a_n = a_1 + (n-1)d', 'Geometric ratio: a_n = a_1 * r^{n-1}']
  },
  {
    id: 'reason-analogy-1',
    title: 'Analogies & Classification',
    description: 'Word analogies, odd-one-out, classification, category mapping and relationship identification.',
    focus: ['Analogies', 'Odd one out', 'Classification', 'Relationship mapping'],
    examples: ['Word pair relations', 'Category grouping', 'Image or shape classification'],
    tips: ['Map analogies to relational templates (A:B :: C:D)', 'Group items by shared attributes'],
    formulas: ['Analogy structure: A is to B as C is to D']
  },
  {
    id: 'reason-blood-1',
    title: 'Blood Relations & Family Trees',
    description: 'Family relation puzzles, symbolic representation of relationships and generational mapping.',
    focus: ['Parent/child mapping', 'In-law relations', 'Gender neutral logic', 'Relation inference'],
    examples: ['Find relation between two members', 'Multi-step family mapping'],
    tips: ['Start from the known relation and work outward', 'Use generational hierarchy diagrams'],
    formulas: []
  },
  {
    id: 'reason-coding-1',
    title: 'Coding-Decoding & Symbol Series',
    description: 'Character or number substitution rules, code pattern extraction, and reversible transforms.',
    focus: ['Substitution rules', 'Reversible codes', 'Position-based mapping', 'Symbol arithmetic'],
    examples: ['Find original word from code', 'Apply shift-based coding'],
    tips: ['Look for consistent character shifts', 'Consider substitution ciphers like Caesar'],
    formulas: []
  },
  {
    id: 'reason-input-1',
    title: 'Input-Output & Machine Logic',
    description: 'Sequential transformation steps applied to strings or numbers; track the pipeline to deduce rules.',
    focus: ['Stepwise transforms', 'Pattern deduction', 'Reverse engineering steps', 'Index mapping'],
    examples: ['Series of operations on numbers', 'String transformation pipelines'],
    tips: ['Trace each operation stepwise', 'Maintain a mapping of input to output'],
    formulas: []
  },
  {
    id: 'reason-direction-1',
    title: 'Directions, Distances & Mapping',
    description: 'Compass directions, left-right turns, shortest path reasoning and grid-based mapping.',
    focus: ['Compass logic', 'Relative movement', 'Coordinate tracking', 'Shortest path reasoning'],
    examples: ['Find final position after moves', 'Minimum steps on grid'],
    tips: ['Use vector addition for direction steps', 'Apply Manhattan distance for grid moves'],
    formulas: ['Distance = |Δx| + |Δy|']
  },
  {
    id: 'reason-data-suff-1',
    title: 'Data Sufficiency & Decision Questions',
    description: 'Evaluate whether provided statements are sufficient to answer a question — common in many competitive and bank exams.',
    focus: ['Statement analysis', 'Sufficiency rules', 'Elimination strategy', 'Practice classification'],
    examples: ['Determine sufficiency combinations', 'Minimal statement identification'],
    tips: ['Identify the minimal set of statements needed', 'Apply logical deduction to eliminate excess'],
    formulas: []
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
    id: 'dsa-strings',
    title: 'Strings',
    description: 'String manipulation, matching, character frequencies, and palindrome checks.',
    questions: [
      { id: '401', title: 'Reverse String', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-string/' },
      { id: '402', title: 'Valid Palindrome', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: '403', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: '404', title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
      { id: '405', title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' }
    ]
  },
  {
    id: 'dsa-linkedlist-stack',
    title: 'Linked List & Stack',
    description: 'Pointer manipulation and last-in-first-out workflows.',
    questions: [
      { id: '101', title: 'Reverse a Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '102', title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      { id: '103', title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: '104', title: 'Min Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/min-stack/' }
    ]
  },
  {
    id: 'dsa-trees-recursion',
    title: 'Trees & Recursion',
    description: 'Depth-first thinking, traversal patterns, and divide-and-conquer.',
    questions: [
      { id: '201', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
      { id: '202', title: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: '203', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: '204', title: 'Path Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' }
    ]
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
  }
];

export const panelAccent = ['bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)]', 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)]', 'bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary)]'];
